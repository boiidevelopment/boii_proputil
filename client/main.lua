----------------------------------
--<!>-- BOII | DEVELOPMENT --<!>--
----------------------------------

-- locals
local prop = nil

-- function to set animation
local function set_animation(data)
    local anim_dictionary = tostring(data.anim_dictionary)
    local anim_name = tostring(data.anim_name)
    local anim_blend_in = tonumber(data.anim_blend_in) or 8.0
    local anim_blend_out = tonumber(data.anim_blend_out) or -8.0
    local anim_duration = tonumber(data.anim_duration) or -1
    local anim_flag = tonumber(data.anim_flag) or 49
    local anim_playback_rate = tonumber(data.anim_playback_rate) or 1
    local anim_lock_x = tonumber(data.anim_lock_x) or 0
    local anim_lock_y = tonumber(data.anim_lock_y) or 0
    local anim_lock_z = tonumber(data.anim_lock_z) or 0    
    RequestAnimDict(anim_dictionary)
    while not HasAnimDictLoaded(anim_dictionary) do
        Wait(10)
    end
    TaskPlayAnim(PlayerPedId(), anim_dictionary, anim_name, anim_blend_in, anim_blend_out, anim_duration, anim_flag, anim_playback_rate, anim_lock_x, anim_lock_y, anim_lock_z)
end

-- function to set prop
local function set_prop(data)
    local coords = GetEntityCoords(PlayerPedId())
    local model_hash = GetHashKey(tostring(data.model_hash))
    local bone_index = tonumber(data.bone_index)
    local x_pos = tonumber(data.x_pos) or 0.0
    local y_pos = tonumber(data.y_pos) or 0.0
    local z_pos = tonumber(data.z_pos) or 0.0
    local x_rot = tonumber(data.x_rot) or 0.0
    local y_rot = tonumber(data.y_rot) or 0.0
    local z_rot = tonumber(data.z_rot) or 0.0
    if not IsModelValid(model_hash) then print("Model is not valid: " .. model_hash) return end
    RequestModel(model_hash)
    while not HasModelLoaded(model_hash) do
        Wait(10)
    end
    local prop = CreateObject(model_hash, coords.x + 2, coords.y, coords.z, true, true, true)
    AttachEntityToEntity(prop, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), bone_index), x_pos, y_pos, z_pos, x_rot, y_rot, z_rot, false, false, false, false, 2, true)
end

-- function to open ui
local function open_ui()
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open_prop_util' })
end

-- function to close ui
local function close_ui()
    SetNuiFocus(false, false)
    ClearPedTasks(PlayerPedId())
    DeleteObject(prop)
end

-- nui callback to set anim
RegisterNUICallback('submit_anim', function(data, cb)
    ClearPedTasks(PlayerPedId())
    close_ui()
    Wait(500)
    local data = data.data
    set_animation(data)
    if cb then
        cb('ok')
    end
end)

-- nui callback to set prop
RegisterNUICallback('submit_prop', function(data, cb)
    local data = data.data
    set_prop(data)
    if cb then
        cb('ok')
    end
end)

-- nui callback to clear animation
RegisterNUICallback('clear_anim', function(data, cb)
    ClearPedTasks(PlayerPedId())
    if cb then
        cb('ok')
    end
end)

-- nui callback to clear prop
RegisterNUICallback('clear_prop', function(data, cb)
    DeleteObject(prop)
    if cb then
        cb('ok')
    end
end)

-- nui callback to close ui
RegisterNUICallback('close_ui', function(data, cb)
    close_ui()
    if cb then
        cb('ok')
    end
end)

-- command to open ui
RegisterCommand('proputility', function()
    open_ui()
end)