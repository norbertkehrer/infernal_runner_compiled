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

const KEY_UP = 1;
const KEY_RIGHT = 2;
const KEY_DOWN = 3;
const KEY_LEFT = 4;
const KEY_JUMP = 5;

var keyboard = new Array(6);

function is_key_pressed(code) {
	return keyboard[code];
};

function release_key(code) {
	keyboard[code] = 0;
};

function set_key_pressed(jcode, state) {
	if (jcode === 37) {
		keyboard[KEY_LEFT] = state;
	} else if (jcode === 38) {
		keyboard[KEY_UP] = state;
	} else if (jcode === 39) {
		keyboard[KEY_RIGHT] = state;
	} else if (jcode === 40) {
		keyboard[KEY_DOWN] = state;
	} else if (jcode === 32 || jcode === 13) {
		keyboard[KEY_JUMP] = state;
	}
}

function set_touch_key(x, y, state) {
	const r = canvas.getBoundingClientRect();
	const w = r.width / 2;
	const h = r.height / 2;
	const x1 = r.left + w / 2;
	const y1 = r.top + h / 2;
	const x2 = x1 + w;
	const y2 = y1 + h;
	if (x < x1) {
		keyboard[KEY_LEFT] = state;
	} else if (x > x2) {
		keyboard[KEY_RIGHT] = state;
	} else if (y < y1) {
		keyboard[KEY_UP] = state;
	} else if (y > y2) {
		keyboard[KEY_DOWN] = state;
	} else {
		keyboard[KEY_JUMP] = state;
	}
}

const PALETTE_CPC = [
	0x00, 0x00, 0x00, /* 0x54 */
	0x00, 0x00, 0x80, /* 0x44 */
	0x00, 0x00, 0xff, /* 0x55 */
	0x80, 0x00, 0x00, /* 0x5c */
	0x80, 0x00, 0x80, /* 0x58 */
	0x80, 0x00, 0xff, /* 0x5d */
	0xff, 0x00, 0x00, /* 0x4c */
	0xff, 0x00, 0x80, /* 0x45 */
	0xff, 0x00, 0xff, /* 0x4d */
	0x00, 0x80, 0x00, /* 0x56 */
	0x00, 0x80, 0x80, /* 0x46 */
	0x00, 0x80, 0xff, /* 0x57 */
	0x80, 0x80, 0x00, /* 0x5e */
	0x80, 0x80, 0x80, /* 0x40 */
	0x80, 0x80, 0xff, /* 0x5f */
	0xff, 0x80, 0x00, /* 0x4e */
	0xff, 0x80, 0x80, /* 0x47 */
	0xff, 0x80, 0xff, /* 0x4f */
	0x00, 0xff, 0x00, /* 0x52 */
	0x00, 0xff, 0x80, /* 0x42 */
	0x00, 0xff, 0xff, /* 0x53 */
	0x80, 0xff, 0x00, /* 0x5a */
	0x80, 0xff, 0x80, /* 0x59 */
	0x80, 0xff, 0xff, /* 0x5b */
	0xff, 0xff, 0x00, /* 0x4a */
	0xff, 0xff, 0x80, /* 0x43 */
	0xff, 0xff, 0xff  /* 0x4b */
];

var palette32 = new Uint32Array(4);

function set_palette_color(pen, ink) {
	const offset = ink * 3;
	palette32[pen] = (0xff << 24) | (PALETTE_CPC[offset + 2] << 16) | (PALETTE_CPC[offset + 1] << 8) | PALETTE_CPC[offset];
};

const SCREEN_W = 320;
const SCREEN_H = 200;

var screen8 = new Uint8Array(SCREEN_W * SCREEN_H); // this is wasting 6 bits per byte but simplifies the lookups

function clear_screen() {
	screen8.fill(0);
};

function draw_object(num, x, y) {
	const w = get_object_width(num);
	const h = get_object_height(num);
	let addr = get_object_addr(num);
	for (var j = 0; j < h; ++j) {
		var offset = (y + j) * SCREEN_W + x * 4;
		for (var i = 0; i < w; ++i) {
			const color_mask = graphics_data[addr++];
			screen8[offset++] ^= (((color_mask >> 3) & 1) << 1) | ((color_mask >> 7) & 1); // bit3, bit7
			screen8[offset++] ^= (((color_mask >> 2) & 1) << 1) | ((color_mask >> 6) & 1); // bit2, bit6
			screen8[offset++] ^= (((color_mask >> 1) & 1) << 1) | ((color_mask >> 5) & 1); // bit1, bit5
			screen8[offset++] ^= ((color_mask & 1) << 1) | ((color_mask >> 4) & 1); // bit0, bit4
		};
	};
};


function get_object_width(num) {
	return image_width[num];
}

function get_object_height(num) {
	return image_height[num];
}

function get_object_addr(num) {
	return graphics_position[num];
};

var x_pos = new Array(60); // x_pos
var y_pos = new Array(60); // y_pos

function clear_vars() {
	x_pos.fill(0);
	y_pos.fill(0);
};


//
// game
//

var keys;
var score;
var highscore = 0;
var boxes;
var hunger;
var lifes;
var infinite_lifes = false;
var player_disabled;
var current_object;
var keys_flag;
var player_jumping;
var ticks;
var screen_num;
var break_flag;
var start_pos;
var counter3;
var player_direction;
var player_frame;

function initialize() {
	chest_is_present = [true, true, true, true, true, true, true, true, true, true, true, false, false, false];
	key_is_present = [false, false, true, false, false, true, true, false, false, true, false, true, false, false];
	icecream_is_present = [false, false, false, false, false, false, true, true, false, false, true, false, false, false];
	glass_is_present = [false, true, false, true, false, false, false, false, false, false, false, false, false, false];
	keys = 0;
	score = 0;
	boxes = 0;
	hunger = 99;
	lifes = 6;
	screen_num = 4;
	ticks = 20;
	set_palette_color(2, 21);
	set_palette_color(3, 14);
	start_pos = 0;
}

function restart() {
	if (!infinite_lifes) {
		lifes -= 1;
		if (lifes === 0) {
			state = STATE_TITLE;
			return;
		}
	}
	if (start_pos !== 0) {
		if (start_pos === 6) {
			return;
		}
		screen_num = next_screen[start_pos];
		start_pos += 1;
		counter3 = 100;
	}
	x_pos[0] = screen_initial_player_x[screen_num];
	y_pos[0] = screen_initial_player_y[screen_num];
	player_frame = 1;
	change_screen();
};


function change_screen() {
	clear_screen();
	clear_tilemap();
	draw_panel_score();
	draw_panel_highscore();
	draw_panel_hunger();
	draw_panel_lifes();
	channel_functions[0] = undefined;
	run_game_channels();
	draw_object_food();
	draw_object_reward();
	draw_object_key();
	draw_object_box();
	set_channels_screen();
	draw_object(player_frame, x_pos[0], y_pos[0]);
	player_jumping = 0;
	keys_flag = 0;
	player_disabled = 0;
	break_flag = 0;
	set_channel_boxes();
};


function update_game_state() {
	if (player_disabled === 1) {
		run_channels();
		if (break_flag === 1) {
			return false;
		};
		return true;
	};
	var tile_flags = allowed_directions[get_next_tile()];
	if ((tile_flags & 0xf0) !== 0) { // moving walkway
		draw_object(player_frame, x_pos[0], y_pos[0]);
		if (tile_flags & (1 << 4)) {
			x_pos[0] += 1;
		}
		if (tile_flags & (1 << 5)) {
			x_pos[0] -= 1;
		}
		if (tile_flags & (1 << 6)) {
			y_pos[0] += 1;
		}
		if (tile_flags & (1 << 7)) {
			y_pos[0] -= 1;
		}
		draw_object(player_frame, x_pos[0], y_pos[0]);
	}
	var num = get_next_tile();
	set_channel_function(num, collision_function[num]);
	if (keys_flag !== 1) {
		num = get_next_tile();
		if (character_function[num] !== undefined) {
			set_channel_function(num, character_function[num]);
			keys_flag = 1;
		} else {
			if (start_pos === 0) {
				if (is_key_pressed(KEY_JUMP)) {
					if (player_direction !== 0) {
						set_channel_function(0, jump_left);
					} else {
						set_channel_function(0, jump_right);
					}
					keys_flag = 1;
					player_jumping = 1;
				} else {
					num = get_next_tile();
					if ((allowed_directions[num] & 0xc) !== 0) { // stairs
						if (is_key_pressed(KEY_UP)) {
							set_channel_function(0, cursor_up);
							keys_flag = 1;
						} else if (is_key_pressed(KEY_DOWN)) {
							set_channel_function(0, cursor_down);
							keys_flag = 1;
						}
					}
					if (is_key_pressed(KEY_RIGHT)) {
						set_channel_function(1, cursor_right);
						keys_flag = 1;
						player_direction = 0;
					} else if (is_key_pressed(KEY_LEFT)) {
						set_channel_function(1, cursor_left);
						keys_flag = 1;
						player_direction = 1;
					}
				}
			}
		}
	}
	handle_food();
	handle_reward();
	handle_key();
	handle_box();
	run_channels();
	if (boxes === 10 && screen_num === 3 && x_pos[0] === 2 && y_pos[0] === 130) {
		state = STATE_COMPLETED;
	} else {

		if (start_pos !== 0) {
			const tmp = start_pos;
			start_pos = 0;
			if (is_key_pressed(KEY_JUMP)) {
				return false;
			}
			start_pos = tmp;
			counter3 -= 1;
			if (counter3 === 0) {
				return false;
			}
		}
		if (y_pos[0] === 0 || y_pos[0] === 1) {
			y_pos[0] = 150;
			screen_num += 3;
			change_screen();
		} else if (y_pos[0] > 151) {
			y_pos[0] = 2;
			screen_num -= 3;
			change_screen();
		} else if (x_pos[0] === 0) {
			x_pos[0] = 77;
			screen_num -= 1;
			change_screen();
		} else if (x_pos[0] > 79) {
			x_pos[0] = 2;
			screen_num += 1;
			change_screen();
		}
	}
	return true;
}


function draw_object_food() {
	if (icecream_is_present[screen_num]) {
		const x = icecream_x[screen_num];
		const y = icecream_y[screen_num];
		draw_object(gr_ice_cream, x, y);
		tilemap_x_pos = x >> 1;
		tilemap_y_pos = (y + 7) >> 3;
		tilemap[get_tile_offset()] = 0x32;
	};
};


function handle_food() {
	if (get_next_tile() === 0x32) {
		tilemap[tilemap_offset] = 1;
		icecream_is_present[screen_num] = false;
		const x = icecream_x[screen_num];
		const y = icecream_y[screen_num];
		draw_object(gr_ice_cream, x, y);
		increase_score(1);
		draw_panel_hunger();
		hunger = 99;
		draw_panel_hunger();
	}
}


function draw_object_reward() {
	if (glass_is_present[screen_num]) {
		const x = glass_x[screen_num];
		const y = glass_y[screen_num];
		draw_object(gr_glass_full, x, y);
		tilemap_x_pos = x >> 1;
		tilemap_y_pos = (y + 4) >> 3;
		tilemap[get_tile_offset()] = 0x33;
	};
};


function handle_reward() {
	if (get_next_tile() === 0x33) {
		tilemap[tilemap_offset] = 1;
		glass_is_present[screen_num] = false;
		const x = glass_x[screen_num];
		const y = glass_y[screen_num];
		draw_object(gr_glass_full, x, y);
		increase_score(2);
		draw_panel_hunger();
		hunger = 99;
		draw_panel_hunger();
	};
};


function draw_object_key() {
	if (key_is_present[screen_num]) {
		const x = key_x[screen_num];
		const y = key_y[screen_num];
		draw_object(gr_key, x, y);
		tilemap_x_pos = x >> 1;
		tilemap_y_pos = (y + 5) >> 3;
		tilemap[get_tile_offset()] = 0x34;
	};
};


function handle_key() {
	if (get_next_tile() === 0x34) {
		tilemap[tilemap_offset] = 1;
		key_is_present[screen_num] = false;
		const x = key_x[screen_num];
		const y = key_y[screen_num];
		draw_object(gr_key, x, y);
		keys += 2;
		increase_score(5);
	};
};


function draw_object_box() {
	if (chest_is_present[screen_num]) {
		const x = chest_x[screen_num];
		const y = chest_y[screen_num] + 4;
		draw_object(gr_chest_closed, x, y);
		tilemap_x_pos = x >> 1;
		tilemap_y_pos = (y + 4) >> 3;
		tilemap[get_tile_offset()] = 0x35;
	}
}


function handle_box() {
	if (get_next_tile() === 0x35) {
		tilemap[tilemap_offset] = 1;
		chest_is_present[screen_num] = false;
		const x = chest_x[screen_num];
		const y = chest_y[screen_num] + 4;
		draw_object(gr_chest_closed, x, y);
		draw_object(gr_chest_open, x, y);
		increase_score(4);
		boxes += 1;
		keys -= 1;
		set_channel_boxes();
	};
};


function increase_score(n) {
	draw_panel_highscore();
	draw_panel_score();
	score += 67 * n;
	if (score > highscore) {
		highscore = score;
	};
	draw_panel_highscore();
	draw_panel_score();
};

//
// Tilemap
//

var tilemap = new Array(40 * 21);
var tilemap_x_pos;
var tilemap_y_pos;
var tilemap_offset;


function clear_tilemap() {
	tilemap.fill(0);
};


function get_tile_offset() {
	tilemap_offset = tilemap_x_pos;
	if (tilemap_y_pos !== 0) {
		tilemap_offset += tilemap_y_pos * 40;
	};
	return tilemap_offset;
};


function get_current_tile() {
	tilemap_x_pos = x_pos[0] >> 1;
	tilemap_y_pos = (y_pos[0] + 8) >> 3;
	return tilemap[get_tile_offset()];
};


function get_next_tile() {
	var num = get_current_tile();
	if (num === 0) {
		x_pos[0] += 1;
		num = get_current_tile();
		x_pos[0] -= 1;
	}
	return num;
};


//
// Score display
//

function draw_panel_number(num, digits, x, y) {
	x += digits * 2;
	for (let i = 0; i < digits; ++i) {
		x -= 2;
		draw_object(gr_0 + (num % 10), x, y);
		num = (num / 10) >> 0;
	}
}


function draw_panel_score() {
	draw_panel_number(score, 6, 36, 176);
};


function draw_panel_highscore() {
	draw_panel_number(highscore, 6, 64, 176);
};


function draw_panel_hunger() {
	draw_panel_number(hunger, 2, 40, 184);
};


function draw_panel_lifes() {
	draw_panel_number(lifes, 2, 68, 184);
};



//
// HTML
//

var canvas;
var timer;
var audio;

const INTERVAL = 100;

function init(name) {
	canvas = document.getElementById(name);
	document.onkeydown = function (e) { set_key_pressed(e.keyCode, 1); }
	document.onkeyup = function (e) { set_key_pressed(e.keyCode, 0); }
	canvas.addEventListener('mousedown', function (e) { set_touch_key(e.clientX, e.clientY, 1); });
	canvas.addEventListener('mouseup', function (e) { set_touch_key(e.clientX, e.clientY, 0); });
	audio = new Audio('inferrun.ogg');
	audio.addEventListener('ended', function () { this.currentTime = 0; this.play(); }, false);
	reset();
};


function pause_game() {
	if (timer) {
		audio.pause();
		clearInterval(timer);
		timer = null;
		return true;
	};
	audio.play();
	timer = setInterval(tick, INTERVAL);
	return false;
};


function reset() {
	clear_vars();
	set_palette_color(0, 0);
	set_palette_color(1, 6);
	state = STATE_TITLE;
	if (timer) {
		clearInterval(timer);
	};
	timer = setInterval(tick, INTERVAL);
};


function mute() {
	if (!audio.paused) {
		audio.pause();
		return true;
	}
	audio.play();
	return false;
};


function set_infinite_lifes(b) {
	infinite_lifes = b;
};


function update_screen() {
	var context = canvas.getContext('2d');
	var data = context.getImageData(0, 0, SCREEN_W, SCREEN_H);
	var rgba = new Uint32Array(data.data.buffer);
	for (var i = 0; i < SCREEN_W * SCREEN_H; ++i) {
		const color = screen8[i];
		rgba[i] = palette32[color];
	};
	context.putImageData(data, 0, 0);
};


const STATE_TITLE = 1;
const STATE_GAME = 2;
const STATE_COMPLETED = 3;

var state, prev_state;

function tick() {
	if (state !== prev_state) {
		if (state === STATE_TITLE) {
			clear_screen();
			set_palette_color(2, 2);
			set_palette_color(3, 26);
			clear_channels();
			set_channel_function(10, draw_title_screen);
		} else if (state === STATE_GAME) {
			initialize();
			restart();
		} else if (state === STATE_COMPLETED) {
			clear_screen();
			clear_tilemap();
			clear_channels();
			set_channel_function(10, draw_game_completion_screen);
			player_direction = 200;
		}
		prev_state = state;
	}
	if (state === STATE_TITLE) {
		run_channels();
		if (is_key_pressed(KEY_JUMP)) {
			release_key(KEY_JUMP);
			state = STATE_GAME;
		}
	} else if (state === STATE_GAME) {
		if (!update_game_state()) {
			restart();
		} else {
			ticks -= 1;
			if (ticks === 0) {
				ticks = 18;
				draw_panel_hunger();
				hunger -= 1;
				draw_panel_hunger();
				if (hunger === 0) {
					restart();
				}
			}
		}
	} else if (state === STATE_COMPLETED) {
		run_channels();
		player_direction -= 1;
		if (player_direction === 0) {
			state = STATE_TITLE;
		}
	}
	update_screen();
};
