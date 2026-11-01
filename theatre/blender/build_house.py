"""Builds the theatre house in Blender, bakes its occlusion with Cycles and exports it for the web.

  python theatre/blender/prep_house.py
  "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup --python theatre/blender/build_house.py -- [--preview]

The house is everything that stays when productions change:
  arch      the proscenium as carved relief: its height comes from the painting, so the gilt stands proud
            and the panels sink. Its cut edge is extruded back, so the opening has real inner returns.
  floor     stage boards, each a bevelled plank with its own tone and wear, with tracks for sliding flats
  fender    a brass fender in front of the footlights
  pit       the orchestra rail: brass posts and a rail, with small warm lamps on the music stands
  opening   an empty that tells the theatre the stage opening and the floor height

Occlusion is baked into the colour of the arch and the floor, so the carving and the boards keep their contact
shadows under every lighting cue. Direct light stays live in the theatre.
Writes theatre/public/house/house.glb, and with --preview a Cycles render at theatre/blender/work/preview.png.

Axes: Blender X = theatre x, Blender Z = theatre y (up), Blender -Y = theatre z (toward the audience).
"""
import json, math, os, random, sys

import bmesh
import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.join(HERE, "work")
OUT = os.path.join(HERE, "..", "public", "house", "house.glb")
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in args

meta = json.load(open(os.path.join(WORK, "meta.json")))
PW = 7.2
PH = PW / meta["aspect"]
HL, HT, HR, HB = meta["hole"]
FLOOR = PH * (1 - HB) + 0.005
OPEN_W = PW * (HR - HL)
OPEN_H = PH * (HB - HT)
RELIEF = 0.06  # depth of the deepest carving
THICK = 0.12

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
for kind in ("OPTIX", "CUDA"):
    try:
        prefs.compute_device_type = kind
        prefs.get_devices()
        if any(d.type == kind for d in prefs.devices):
            for d in prefs.devices:
                d.use = d.type == kind
            break
    except TypeError:
        continue
scene.cycles.device = "GPU"
random.seed(7)


# ---------------------------------------------------------------- materials

def principled(name, color=(0.5, 0.5, 0.5), rough=0.6, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


def image_material(name, image, rough=0.6):
    m = principled(name, rough=rough)
    nt = m.node_tree
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = image
    nt.links.new(tex.outputs["Color"], nt.nodes["Principled BSDF"].inputs["Base Color"])
    nt.links.new(tex.outputs["Alpha"], nt.nodes["Principled BSDF"].inputs["Alpha"])
    return m


def bake_target(material, image):
    """Adds an image node, selected and active, for Cycles to bake into."""
    nt = material.node_tree
    node = nt.nodes.new("ShaderNodeTexImage")
    node.image = image
    for n in nt.nodes:
        n.select = False
    node.select = True
    nt.nodes.active = node
    return node


def pixels(img):
    return np.array(img.pixels[:], np.float32).reshape(img.size[1], img.size[0], 4)


def link(obj):
    scene.collection.objects.link(obj)
    return obj


# ---------------------------------------------------------------- arch

def build_arch():
    albedo = bpy.data.images.load(os.path.join(WORK, "albedo.png"))
    A = pixels(albedo)
    himg = bpy.data.images.load(os.path.join(WORK, "height.png"))
    himg.colorspace_settings.name = "Non-Color"
    H = pixels(himg)[..., 0]
    h, w = A.shape[:2]
    NX, NZ = 560, int(560 / meta["aspect"])
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    grid = []
    for j in range(NZ + 1):
        v = j / NZ
        py = min(int(v * (h - 1)), h - 1)
        row = []
        for i in range(NX + 1):
            u = i / NX
            px = min(int(u * (w - 1)), w - 1)
            row.append(bm.verts.new(((u - 0.5) * PW, -float(H[py, px]) * RELIEF, v * PH)))
        grid.append(row)
    for j in range(NZ):
        for i in range(NX):
            if A[int((j + 0.5) / NZ * (h - 1)), int((i + 0.5) / NX * (w - 1)), 3] < 0.5:
                continue
            f = bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
            for loop, (uu, vv) in zip(f.loops, ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))):
                loop[uv].uv = (uu / NX, vv / NZ)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
    # Soften the stair steps of the grid along the cut, so the outline and the opening read as hand-cut curves.
    edge = [v for v in bm.verts if v.is_boundary]
    for _ in range(2):
        bmesh.ops.smooth_vert(bm, verts=edge, factor=0.35, use_axis_x=True, use_axis_y=False, use_axis_z=True)
    # Thickness: the cut edge is extruded straight back, so the opening gets real inner returns.
    # (A solidify modifier threw spikes at the thin slivers along the cut.)
    ret = bmesh.ops.extrude_edge_only(bm, edges=[e for e in bm.edges if e.is_boundary])
    for g in ret["geom"]:
        if isinstance(g, bmesh.types.BMVert):
            g.co.y = THICK
        elif isinstance(g, bmesh.types.BMFace):
            g.material_index = 1
            g.smooth = False
    mesh = bpy.data.meshes.new("arch")
    bm.to_mesh(mesh)
    bm.free()
    obj = link(bpy.data.objects.new("arch", mesh))
    front = image_material("arch_paint", albedo, rough=0.55)
    edge_mat = principled("arch_edge", color=(0.32, 0.2, 0.09), rough=0.42, metal=0.55)
    mesh.materials.append(front)
    mesh.materials.append(edge_mat)
    edge_mat.use_backface_culling = False
    for poly in mesh.polygons:
        poly.use_smooth = poly.material_index == 0
    return obj, albedo, front


# ---------------------------------------------------------------- floor

def wood_material():
    m = principled("boards", rough=0.5)
    nt = m.node_tree
    N = nt.nodes
    L = nt.links.new
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.35, 9.0, 1.0)
    L(tc.outputs["Object"], mp.inputs["Vector"])
    wave = N.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Y"
    wave.inputs["Scale"].default_value = 2.2
    wave.inputs["Distortion"].default_value = 7.0
    wave.inputs["Detail"].default_value = 4.0
    L(mp.outputs["Vector"], wave.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.11, 0.055, 0.025, 1)
    ramp.color_ramp.elements[1].color = (0.33, 0.19, 0.09, 1)
    L(wave.outputs["Fac"], ramp.inputs["Fac"])
    tone = N.new("ShaderNodeMath")
    tone.operation = "MULTIPLY_ADD"
    tone.inputs[1].default_value = 0.45
    tone.inputs[2].default_value = 0.78
    # Each plank has its own tone, stored per vertex when the plank is cut.
    gi = N.new("ShaderNodeAttribute")
    gi.attribute_name = "tone"
    L(gi.outputs["Fac"], tone.inputs[0])
    mul = N.new("ShaderNodeMixRGB")
    mul.blend_type = "MULTIPLY"
    mul.inputs["Fac"].default_value = 1.0
    L(ramp.outputs["Color"], mul.inputs["Color1"])
    L(tone.outputs["Value"], mul.inputs["Color2"])
    # Wear: a broad, lighter path down the centre where the puppeteers walk, and darker scuffs.
    wear = N.new("ShaderNodeTexNoise")
    wear.inputs["Scale"].default_value = 1.4
    L(tc.outputs["Object"], wear.inputs["Vector"])
    wr = N.new("ShaderNodeValToRGB")
    wr.color_ramp.elements[0].position = 0.45
    wr.color_ramp.elements[0].color = (0.82, 0.78, 0.72, 1)
    wr.color_ramp.elements[1].color = (1.12, 1.05, 0.95, 1)
    L(wear.outputs["Fac"], wr.inputs["Fac"])
    mul2 = N.new("ShaderNodeMixRGB")
    mul2.blend_type = "MULTIPLY"
    mul2.inputs["Fac"].default_value = 1.0
    L(mul.outputs["Color"], mul2.inputs["Color1"])
    L(wr.outputs["Color"], mul2.inputs["Color2"])
    L(mul2.outputs["Color"], N["Principled BSDF"].inputs["Base Color"])
    return m


def build_floor():
    bm = bmesh.new()
    tone = bm.verts.layers.float.new("tone")
    depth, gap = 0.11, 0.0035
    slots = [0.45, 0.9, 1.4, 1.9, 2.5, 3.1]
    y = -0.02
    half = PW / 2 - 0.08  # the boards stop inside the arch, so none shows past it from the house
    while y < 6.4:
        d = depth
        g = gap
        if any(abs(y - s) < depth / 2 for s in slots):
            g = 0.014  # a track for sliding flats
        x = -half
        while x < half:
            length = min(half - x, random.uniform(1.4, 3.2))
            t = random.random()
            jitter = random.uniform(-0.0012, 0.0012)
            res = bmesh.ops.create_cube(bm, size=1.0)
            vs = res["verts"]
            bmesh.ops.scale(bm, vec=(length - 0.004, d - g, 0.03), verts=vs)
            bmesh.ops.translate(bm, vec=(x + length / 2, y + d / 2, FLOOR - 0.015 + jitter), verts=vs)
            for v in vs:
                v[tone] = t
            x += length
        y += d
    mesh = bpy.data.meshes.new("floor")
    bm.to_mesh(mesh)
    bm.free()
    obj = link(bpy.data.objects.new("floor", mesh))
    mesh.materials.append(wood_material())
    bev = obj.modifiers.new("bevel", "BEVEL")
    bev.width = 0.0025
    bev.segments = 2
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier="bevel")
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.002)
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.select_set(False)
    return obj


# ---------------------------------------------------------------- brass: fender and orchestra rail

def cylinder(name, r, depth, loc, rot=(0, 0, 0), mat=None, verts=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    if mat:
        o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o


def build_brass():
    brass = principled("brass", color=(0.78, 0.56, 0.26), rough=0.28, metal=1.0)
    wood = principled("pit_wood", color=(0.05, 0.03, 0.02), rough=0.5)
    lamp = principled("stand_lamp", color=(1.0, 0.8, 0.5), rough=0.4, emit=(1.0, 0.72, 0.4), strength=8.0)
    parts = []
    # The footlight fender: a low brass rail on the stage lip, in front of the footlights.
    parts.append(cylinder("fender", 0.012, OPEN_W + 0.2, (0, -0.21, FLOOR + 0.035), rot=(0, math.pi / 2, 0), mat=brass))
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.11, FLOOR - 0.012))
    lip = bpy.context.active_object
    lip.name = "lip"
    lip.scale = (OPEN_W + 0.2, 0.22, 0.024)
    lip.data.materials.append(wood)
    parts.append(lip)
    # The orchestra rail in front of the stage.
    rail_y, top = -1.4, FLOOR - 0.08
    parts.append(cylinder("rail", 0.016, PW - 0.6, (0, rail_y, top), rot=(0, math.pi / 2, 0), mat=brass))
    x = -(PW - 0.6) / 2
    while x <= (PW - 0.6) / 2 + 1e-6:
        parts.append(cylinder("post", 0.01, top, (x, rail_y, top / 2), mat=brass, verts=12))
        x += 0.6
    # Lamps on the music stands below the rail: small brass hoods with a warm glow under them.
    for i, x in enumerate([-2.6, -1.7, -0.8, 0.15, 1.05, 1.95, 2.8]):
        z = top - 0.12 - random.uniform(0, 0.05)
        bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=0.045, radius2=0.012, depth=0.05, location=(x, rail_y + 0.12, z))
        hood = bpy.context.active_object
        hood.name = f"hood{i}"
        hood.data.materials.append(brass)
        bpy.ops.mesh.primitive_circle_add(vertices=20, radius=0.04, fill_type="NGON", location=(x, rail_y + 0.12, z - 0.026))
        glow = bpy.context.active_object
        glow.name = f"standlamp{i}"
        glow.data.materials.append(lamp)
        parts += [hood, glow]
    return parts


# ---------------------------------------------------------------- bake

def bake_arch(arch, albedo, front):
    ao = bpy.data.images.new("arch_ao", albedo.size[0], albedo.size[1], float_buffer=True)
    ao.colorspace_settings.name = "Non-Color"
    node = bake_target(front, ao)
    edge_tmp = bpy.data.images.new("edge_tmp", 64, 64)
    bake_target(bpy.data.materials["arch_edge"], edge_tmp)
    scene.cycles.samples = 256
    for o in scene.objects:
        o.select_set(False)
    arch.select_set(True)
    bpy.context.view_layer.objects.active = arch
    scene.render.bake.margin = 8
    bpy.ops.object.bake(type="AO")
    front.node_tree.nodes.remove(node)
    a = pixels(albedo)
    occ = pixels(ao)[..., :1]
    out = a.copy()
    out[..., :3] = a[..., :3] * (0.32 + 0.68 * np.power(occ, 1.15))
    baked = bpy.data.images.new("arch_paint_baked", albedo.size[0], albedo.size[1], alpha=True)
    baked.pixels.foreach_set(out.ravel())
    baked.filepath_raw = os.path.join(WORK, "arch_paint_baked.png")
    baked.file_format = "PNG"
    baked.save()
    for n in front.node_tree.nodes:
        if n.type == "TEX_IMAGE" and n.image == albedo:
            n.image = baked
    return baked


def bake_floor(floor):
    size = 2048
    col = bpy.data.images.new("floor_col", size, size)
    ao = bpy.data.images.new("floor_ao", size, size, float_buffer=True)
    ao.colorspace_settings.name = "Non-Color"
    mat = floor.data.materials[0]
    for o in scene.objects:
        o.select_set(False)
    floor.select_set(True)
    bpy.context.view_layer.objects.active = floor
    scene.render.bake.margin = 4
    node = bake_target(mat, col)
    scene.cycles.samples = 16
    bpy.ops.object.bake(type="DIFFUSE", pass_filter={"COLOR"})
    node.image = ao
    scene.cycles.samples = 128
    bpy.ops.object.bake(type="AO")
    c, o = pixels(col), pixels(ao)[..., :1]
    c[..., :3] = c[..., :3] * (0.25 + 0.75 * o)
    c[..., 3] = 1
    out = bpy.data.images.new("boards_baked", size, size)
    out.pixels.foreach_set(c.ravel())
    out.filepath_raw = os.path.join(WORK, "boards_baked.png")
    out.file_format = "PNG"
    out.save()
    # The exported floor carries only the baked texture.
    baked = image_material("boards_baked", out, rough=0.48)
    floor.data.materials[0] = baked


# ---------------------------------------------------------------- preview

def preview():
    """A Cycles render from the centre seat, lit by three spots, to check the relief and the bake."""
    aim = link(bpy.data.objects.new("aim", None))
    aim.location = (0, 1.0, FLOOR + 1.05)
    cam = link(bpy.data.objects.new("cam", bpy.data.cameras.new("cam")))
    cam.location = (0, -9.4, FLOOR + 0.95)
    cam.data.lens = 28
    cam.data.sensor_width = 36
    c = cam.constraints.new("TRACK_TO")
    c.target = aim
    scene.camera = cam
    for name, loc, energy, color in [("key", (-3.5, -6.5, FLOOR + 4.5), 2500, (1, 0.88, 0.72)), ("fill", (3.5, -6.5, FLOOR + 4.5), 1500, (0.85, 0.88, 1)),
                                     ("foot", (0, -1.6, FLOOR + 0.05), 150, (1, 0.7, 0.4))]:
        light = link(bpy.data.objects.new(name, bpy.data.lights.new(name, "SPOT")))
        light.data.energy = energy
        light.data.color = color
        light.data.spot_size = math.radians(75)
        light.data.spot_blend = 0.6
        light.location = loc
        t = light.constraints.new("TRACK_TO")
        t.target = aim
    scene.world = bpy.data.worlds.new("w")
    scene.world.color = (0.003, 0.003, 0.004)
    scene.render.resolution_x, scene.render.resolution_y = 1600, 900
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.render.filepath = os.path.join(WORK, "preview.png")
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(aim)


# ---------------------------------------------------------------- run

arch, albedo, front = build_arch()
floor = build_floor()
brass = build_brass()
opening = bpy.data.objects.new("opening", None)
opening.location = (PW * ((HL + HR) / 2 - 0.5), 0, FLOOR + OPEN_H / 2)
opening["floor"] = FLOOR
opening["openW"] = OPEN_W
opening["openH"] = OPEN_H
opening["prosceniumW"] = PW
opening["prosceniumH"] = PH
link(opening)
bake_arch(arch, albedo, front)
bake_floor(floor)
if PREVIEW:
    preview()
for o in list(scene.objects):
    if o.type in ("CAMERA", "LIGHT"):
        bpy.data.objects.remove(o)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_extras=True, export_apply=True, export_yup=True,
                          export_image_format="WEBP", export_cameras=False, export_lights=False)
print("HOUSE", OUT, "floor", round(FLOOR, 4), "opening", round(OPEN_W, 3), round(OPEN_H, 3))
