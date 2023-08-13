//------------------------------\\
//---\\ BOII | DEVELOPMENT //---\\
//------------------------------\\

// animation inputs
let animation_params = [
    { id: 'anim_dictionary', label: 'Dictionary:', data_type: 'string', placeholder: 'animDictionary' },
    { id: 'anim_name', label: 'Animation:', data_type: 'string', placeholder: 'animationName' },
    { id: 'anim_blend_in', label: 'Blend In Speed:', data_type: 'number', placeholder: 'blendInSpeed ' },
    { id: 'anim_blend_out', label: 'Blend Out Speed:', data_type: 'number', placeholder: 'blendOutSpeed ' },
    { id: 'anim_duration', label: 'Duration:', data_type: 'number', placeholder: 'duration' },
    { id: 'anim_flag', label: 'Flag:', data_type: 'number', placeholder: 'flag' },
    { id: 'anim_playback_rate', label: 'Playback Rate:', data_type: 'number', placeholder: 'playbackRate' },
    { id: 'anim_lock_x', label: 'Lock X:', data_type: 'boolean', placeholder: 'lockX' },
    { id: 'anim_lock_y', label: 'Lock Y:', data_type: 'boolean', placeholder: 'lockY' },
    { id: 'anim_lock_z', label: 'Lock Z:', data_type: 'boolean', placeholder: 'lockZ' },
];

// prop inputs
let prop_params = [
    { id: 'model_hash', label: 'Model Hash:', data_type: 'string', placeholder: 'modelHash' },
    { id: 'bone_index', label: 'Bone Index:', data_type: 'number', placeholder: '60309' },
    { id: 'x_pos', label: 'X Position:', data_type: 'number', placeholder: '0.001' },
    { id: 'y_pos', label: 'Y Position:', data_type: 'number', placeholder: '0.001' },
    { id: 'z_pos', label: 'Z Position:', data_type: 'number', placeholder: '0.001' },
    { id: 'x_rot', label: 'X Rotation:', data_type: 'number', placeholder: '0.001' },
    { id: 'y_rot', label: 'Y Rotation:', data_type: 'number', placeholder: '0.001' },
    { id: 'z_rot', label: 'Z Rotation:', data_type: 'number', placeholder: '0.001' }

];

$(document).ready(function() {
    animation_params.forEach(param => {
        $('#animation_tab').append(create_input_element(param));
    });
    prop_params.forEach(param => {
        $('#prop_tab').append(create_input_element(param));
    });
    // create elements
    function create_input_element(param) {
        let label = $('<label>').attr('for', param.id).text(param.label).addClass('input_label');
        let input;
        switch(param.data_type) {
            case 'string':
                input = $('<input>').attr({ type: 'text', placeholder: param.placeholder }).addClass('input_field');
                break;
            case 'number':
            case 'integer':
                input = $('<input>').attr({ type: 'number', placeholder: param.placeholder }).addClass('input_field');
                break;
            case 'boolean':
                input = $('<select>').addClass('input_field');
                input.append($('<option>').attr({ value: "false" }).text("False"));
                input.append($('<option>').attr({ value: "true" }).text("True"));
                break;
            default:
                input = $('<input>').attr({ type: 'text', placeholder: param.placeholder }).addClass('input_field');
                break;
        }
        input.attr('id', param.id);
        let container = $('<div>').addClass('input_container');
        container.append(label, input);
        return container;
    }
    $('#animation_tab').append(create_button_container('animation'));
    $('#prop_tab').append(create_button_container('prop'));
    // create buttons
    function create_button_container(tab_type) {
        let button_container = $('<div>').addClass('tab_button_container');
        let submit_button_id = `${tab_type}_submit_button`;
        let cancel_button_id = `${tab_type}_cancel_button`;
        let copy_button_id = `${tab_type}_copy_button`;
        let submit_button = $('<button>').attr('id', submit_button_id).text('Submit');
        let cancel_button = $('<button>').attr('id', cancel_button_id).text('Cancel');
        let copy_button = $('<button>').attr('id', copy_button_id).text('Copy');
        button_container.append(submit_button, cancel_button, copy_button);
        return button_container;
    }
    // button functions
    $('#animation_submit_button').click(() => submit_data('animation'));
    $('#animation_cancel_button').click(() => cancel_data('animation'));
    $('#prop_submit_button').click(() => submit_data('prop'));
    $('#prop_cancel_button').click(() => cancel_data('prop'));
    $('#animation_copy_button').click(() => copy_data('animation'));
    $('#prop_copy_button').click(() => copy_data('prop'));
    // copy data
    function copy_data(tab_type) {
        let data = {};
        if (tab_type === 'animation') {
            animation_params.forEach(param => {
                data[param.id] = $('#' + param.id).val();
            });
        } else if (tab_type === 'prop') {
            prop_params.forEach(param => {
                data[param.id] = $('#' + param.id).val();
            });
        }
        let lua_function_string = generate_lua_paste(data, tab_type);
        navigator.clipboard.writeText(lua_function_string).then(function() {
            console.log('Copy to clipboard was successful!');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }
    
    // generate lua paste functions
    function generate_lua_paste(data, tab_type) {
        if (tab_type === 'animation') {
            return `
function play_animation()
    local anim_dictionary = "${data.anim_dictionary}"
    local anim_name = "${data.anim_name}"
    local anim_blend_in = ${data.anim_blend_in}
    local anim_blend_out = ${data.anim_blend_out}
    local anim_duration = ${data.anim_duration}
    local anim_flag = ${data.anim_flag}
    local anim_playback_rate = ${data.anim_playback_rate}
    local anim_lock_x = ${data.anim_lock_x}
    local anim_lock_y = ${data.anim_lock_y}
    local anim_lock_z = ${data.anim_lock_z}    
    RequestAnimDict(anim_dictionary)
    while not HasAnimDictLoaded(anim_dictionary) do
        Wait(10)
    end
    TaskPlayAnim(PlayerPedId(), anim_dictionary, anim_name, anim_blend_in, anim_blend_out, anim_duration, anim_flag, anim_playback_rate, anim_lock_x, anim_lock_y, anim_lock_z)
end
`;
        } else if (tab_type === 'prop') {
            return `
function attach_prop()
    local coords = GetEntityCoords(PlayerPedId())
    local model_hash = GetHashKey("${data.model_hash}")
    local bone_index = ${data.bone_index}
    local x_pos = ${data.x_pos} or 0
    local y_pos = ${data.y_pos} or 0
    local z_pos = ${data.model_hash} or 0
    local x_rot = ${data.z_pos} or 0
    local y_rot = ${data.x_rot} or 0
    local z_rot = ${data.z_rot} or 0
    RequestModel(model_hash)
    while not HasModelLoaded(model_hash) do
        Wait(10)
    end
    local prop = CreateObject(model_hash, coords.x + 2, coords.y, coords.z, true, true, true)
    AttachEntityToEntity(prop, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), bone_index), x_pos, y_pos, z_pos, x_rot, y_rot, z_rot, false, false, false, false, 2, true)
end
            `;
        }
    }
    
    // submit data
    function submit_data(tab_type) {
        let data = {};
        if (tab_type === 'animation') {
            animation_params.forEach(param => {
                if (param.data_type === 'boolean') {
                    data[param.id] = $('#' + param.id).val() === "true" ? 1 : 0;
                } else {
                    data[param.id] = $('#' + param.id).val();
                }
            });
            $.post(`https://boii_proputil/submit_anim`, JSON.stringify({data}));
        } else if (tab_type === 'prop') {
            prop_params.forEach(param => {
                data[param.id] = $('#' + param.id).val();
            });
            $.post(`https://boii_proputil/submit_prop`, JSON.stringify({data}));
        }
    }

    // cancel data
    function cancel_data(tab_type) {
        if (tab_type === 'animation') {
            $.post(`https://boii_proputil/clear_anim`, JSON.stringify({}));
        } else if (tab_type === 'prop') {
            $.post(`https://boii_proputil/clear_prop`, JSON.stringify({}));
        }
        reset_fields(tab_type);
    }
});

// esc key to close ui
$(document).keyup(function(exit) {
    if (exit.keyCode === 27) {
        close_ui();
    }
});

// close ui
function close_ui() {
    $('#prop_utility').hide();
    $.post(`https://boii_proputil/close_ui`, JSON.stringify({}));
}

// switch tabs
function switch_tab(tab_id) {
    $('.tab_content').hide();
    $('#' + tab_id).show();
}

// reset input fields
function reset_fields(tab_type) {
    if (tab_type === 'animation') {
        animation_params.forEach(param => {
            $('#' + param.id).val('');
        });
    } else if (tab_type === 'prop') {
        prop_params.forEach(param => {
            $('#' + param.id).val('');
        });
        increment_fields.forEach(field => {
            $('#increment_value_' + field.id).val('');
        });
    } else {
        animation_params.forEach(param => {
            $('#' + param.id).val('');
        });
        prop_params.forEach(param => {
            $('#' + param.id).val('');
        });
        increment_fields.forEach(field => {
            $('#increment_value_' + field.id).val('');
        });
    }
}

// Listen for events to open/close the prop utility
window.addEventListener('message', function(event) {
    let data = event.data;
    if (data.action === 'open_prop_util') {
        $('#prop_utility').show();
    }   
});
