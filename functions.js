// *************************************************
// Infernal Runner compiled to JavaScript
// *************************************************
//
// by Norbert Kehrer in September/October 2020
// https://norbertkehrer.github.io
//
// based on Gregory Montoir's VM interpreter
// https://github.com/cyxx/infernal_js
//
// *************************************************



// Functions for the bytecode instructions

function draw_image_at_player_position() {
    draw_object(player_frame, x_pos[obj_player], y_pos[obj_player]);
};


function make_player_x_even() {
    x_pos[obj_player] &= ~1;
};


function schedule_routine_as_task(routine, task) {
    set_channel_function(task, routine);
};


function add_to_x(n) {
    if (player_disabled != 1 && current_object == obj_player) {
        if ((allowed_directions[get_next_tile()] & (1 << 0)) == 0) {
            return;
        };
    };
    x_pos[current_object] += n;
};


function subtract_from_x(n) {
    if (player_disabled != 1 && current_object == obj_player) {
        if ((allowed_directions[get_next_tile()] & (1 << 1)) == 0) {
            return;
        };
    };
    x_pos[current_object] -= n;
};


function add_to_y(n) {
    if (player_disabled != 1 && current_object == obj_player) {
        if ((allowed_directions[get_next_tile()] & (1 << 2)) == 0) {
            return;
        };
    };
    y_pos[current_object] += n;
};


function subtract_from_y(n) {
    if (player_disabled != 1 && player_jumping != 1 && current_object == obj_player) {
        if ((allowed_directions[get_next_tile()] & (1 << 3)) == 0) {
            return;
        };
    };
    y_pos[current_object] -= n;
};


function set_object_x(n) {
    x_pos[current_object] = n;
};


function set_object_y(n) {
    y_pos[current_object] = n;
};


function set_char_at_pos(x, y, char) {
    tilemap_x_pos = x;
    tilemap_y_pos = y;
    tilemap[get_tile_offset()] = char;
};


function set_chars_vertical(x, y, count, char) {
    tilemap_x_pos = x;
    tilemap_y_pos = y;
    for (let i = 0; i < count; i++) {
        tilemap[get_tile_offset()] = char;
        tilemap_y_pos += 1;
    };
};


function set_chars_horizontal(x, y, count, char) {
    tilemap_x_pos = x;
    tilemap_y_pos = y;
    for (let i = 0; i < count; i++) {
        tilemap[get_tile_offset()] = char;
        tilemap_x_pos += 1;
    };
};


function draw_image(img) {
    const x = x_pos[current_object];
    const y = y_pos[current_object];
    draw_object(img, x, y);
};


function set_object(obj) {
    current_object = obj;
};


function player_died() {
    break_flag = 1;
};


function land_player() {
    keys_flag = 0;
    player_jumping = 0;
};


function player_off() {
    player_disabled = 1;
};


function set_image(img) {
    player_frame = img;
};


function check_collision_with(char) {
    var w = get_object_width(char);
    var h = get_object_height(char);
    var x = x_pos[current_object]; // b
    var y = y_pos[current_object]; // c
    var px = x_pos[0];
    if (px < x || px + 1 < x) {
        return;
    };
    if (px != x && px + 1 != x) {
        x += w;
        if (px != x && px > x) {
            px += 1;
            if (px != x && px > x) {
                return;
            }
        }
    };
    var py = y_pos[0] + 7;
    if (py < y || py + 5 < y) {
        return;
    };
    if (py != y && py + 5 != y) {
        y += h;
        if (py >= y) {
            py += 5;
            if (py != y && py > y) {
                return;
            }
        }
    };
    set_channel_function(char, collision_function[char]);
};



function draw_images_horizontal(x, y, count, img) {
    for (let i = 0; i < count; i++) {
        draw_object(img, x, y);
        x += get_object_width(img);
    };
};


function draw_images_vertical(x, y, count, img) {
    for (let i = 0; i < count; i++) {
        draw_object(img, x, y);
        y += get_object_height(img);
    };
};


function add_67_to_score() {
    increase_score(1);
};



function die_with_blood(num) {
    const x = x_pos[current_object];
    const y = y_pos[current_object];
    draw_object(num, x, y);
};




// The scheduler

let channel_num;
let channel_functions = new Array(256);


function clear_channels() {
    channel_functions.fill(undefined);
};


function set_channel_function(channel, func) {
    if (typeof func === "function") {
        channel_functions[channel] = func();
    };
};



function run_channels() {
    for (channel_num = 0; channel_num < 256; ++channel_num) {
        func = channel_functions[channel_num];
        if (func !== undefined) {
            const result = func.next();                         // execute/continue function
            if (result.done) {                                  // if function completed, 
                channel_functions[channel_num] = undefined;     //   unschedule it
            }
            else {
                if (result.value === exit) {
                    return;
                };
            };
        };
    };
};



function run_game_channels() {
    clear_channels();
    set_channel_function(1, game_screen_functions[screen_num][0][1]);
    run_channels();
};


function set_channels_screen() {
    clear_channels();
    const screen_functions = game_screen_functions[screen_num];
    for (let i = 1; i < screen_functions.length; i++) {
        const channel_function_tuple = screen_functions[i];
        set_channel_function(channel_function_tuple[0], channel_function_tuple[1]);
    };

};


function set_channel_boxes() {
    if (boxes === 10 && screen_num === 3) {
        set_channel_function(0, draw_green_door_and_land_player);
    };
};





