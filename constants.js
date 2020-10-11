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



// Constants to make the code more readable

const gr_blank = 0x00;
const gr_player_standing_looking_left = 0x01;
const gr_player_standing_looking_right = 0x02;
const gr_player_walking_left = 0x03;
const gr_player_walking_right = 0x04;
const gr_player_climbing_1 = 0x05;
const gr_player_climbing_2 = 0x06;
const gr_player_jumping_left_1 = 0x07;
const gr_player_jumping_right_1 = 0x08;
const gr_player_jumping_left_2 = 0x09;
const gr_player_jumping_right_2 = 0x0a;
const gr_player_falling_down = 0x0b;
const gr_conveyor_head_left_1 = 0x0c;
const gr_ponveyor_head_left_2 = 0x0d;
const gr_conveyor_head_left_3 = 0x0e;
const gr_conveyor_head_left_4 = 0x0f;
const gr_conveyor_head_right_1 = 0x10;
const gr_conveyor_head_right_2 = 0x11;
const gr_conveyor_head_right_3 = 0x12;
const gr_conveyor_belt = 0x13;
const gr_conveyor_head_right_4 = 0x14;
const gr_glass_full = 0x15;
const gr_switch_up = 0x16;
const gr_switch_down = 0x17;
const gr_vertical_bar_blue_1 = 0x18;
const gr_vertical_bar_blue_2 = 0x19;
const gr_vertical_bar_red_1 = 0x1a;
const gr_vertical_bar_red_2 = 0x1b;
const gr_laser_pod_left = 0x1c;
const gr_laser_horiz = 0x1d;
const gr_laser_pod_right = 0x1e;
const gr_laser_pod_top = 0x1f;
const gr_laser_pod_bottom = 0x20;
const gr_laser_vert = 0x21;
const gr_pod_blue = 0x22;
const gr_pod_red = 0x23;
const gr_platform = 0x24;
const gr_key = 0x25;
const gr_chest_closed = 0x26;
const gr_chest_open = 0x27;
const gr_score = 0x28;
const gr_high = 0x29;
const gr_faim = 0x2a;
const gr_vies = 0x2b;
const gr_0 = 0x2c;
const gr_1 = 0x2d;
const gr_2 = 0x2e;
const gr_3 = 0x2f;
const gr_4 = 0x30;
const gr_5 = 0x31;
const gr_6 = 0x32;
const gr_7 = 0x33;
const gr_8 = 0x34;
const gr_9 = 0x35;
const gr_blue_full_block = 0x36;
const gr_red_blue_rect_small = 0x37;
const gr_red_blue_square_small_1 = 0x38;
const gr_red_blue_square_small_2 = 0x39;
const gr_ice_cream = 0x3a;
const gr_blue_square_big = 0x3b;
const gr_lava_1 = 0x3c;
const gr_lava_2 = 0x3d;
const gr_ladder = 0x3e;
const gr_brick_green = 0x3f;
const gr_brick_blue = 0x40;
const gr_brick_blue_green = 0x41;
const gr_brick_full_green = 0x42;
const gr_brick_red_green = 0x43;
const gr_brick_blue_red_1 = 0x44;
const gr_brick_blue_red_2 = 0x45;
const gr_snake_right_1 = 0x46;
const gr_snake_right_2 = 0x47;
const gr_snake_left_1 = 0x48;
const gr_snake_left_2 = 0x49;
const gr_double_flame_pod_bottom = 0x4a;
const gr_double_flame_1 = 0x4b;
const gr_double_flame_2 = 0x4c;
const gr_double_flame_3 = 0x4d;
const gr_double_flame_4 = 0x4e;
const gr_double_flame_5 = 0x4f;
const gr_deadly_sinus_1 = 0x50;
const gr_horiz_flame_1 = 0x51;
const gr_horiz_flame_2 = 0x52;
const gr_horiz_flame_3 = 0x53;
const gr_horiz_flame_4 = 0x54;
const gr_horiz_flame_5 = 0x55;
const gr_thorns_right = 0x56;
const gr_thorns_left = 0x57;
const gr_thorns_bottom = 0x58;
const gr_thorns_top = 0x59;
const gr_skull = 0x5a;
const gr_bush = 0x5b;
const gr_player_headless = 0x5c;
const gr_red_head_1 = 0x5d;
const gr_red_head_2 = 0x5e;
const gr_red_head_3 = 0x5f;
const gr_red_cave_wall_00 = 0x60;
const gr_red_cave_wall_01 = 0x61;
const gr_red_cave_wall_02 = 0x62;
const gr_red_cave_wall_03 = 0x63;
const gr_red_cave_wall_04 = 0x64;
const gr_red_cave_wall_05 = 0x65;
const gr_red_cave_wall_06 = 0x66;
const gr_red_cave_wall_07 = 0x67;
const gr_red_cave_wall_08 = 0x68;
const gr_red_cave_wall_09 = 0x69;
const gr_red_cave_wall_0a = 0x6a;
const gr_red_cave_wall_0b = 0x6b;
const gr_red_cave_wall_0c = 0x6c;
const gr_red_cave_wall_0d = 0x6d;
const gr_red_cave_wall_0e = 0x6e;
const gr_red_cave_wall_0f = 0x6f;
const gr_red_cave_wall_10 = 0x70;
const gr_red_cave_wall_11 = 0x71;
const gr_red_cave_wall_12 = 0x72;
const gr_red_cave_wall_13 = 0x73;
const gr_red_cave_wall_14 = 0x74;
const gr_red_cave_wall_15 = 0x75;
const gr_red_cave_wall_16 = 0x76;
const gr_red_cave_wall_17 = 0x77;
const gr_red_cave_wall_18 = 0x78;
const gr_red_cave_wall_19 = 0x79;
const gr_player_vaporized_1 = 0x7a;
const gr_player_vaporized_2 = 0x7b;
const gr_player_vaporized_3 = 0x7c;
const gr_player_vaporized_4 = 0x7d;
const gr_player_vaporized_5 = 0x7e;
const gr_vert_conveyor_red = 0x7f;
const gr_triangle_right_top = 0x80;
const gr_triangle_left_bottom = 0x81;
const gr_player_skelleton_1 = 0x82;
const gr_player_skelleton_2 = 0x83;
const gr_player_skelleton_3 = 0x84;
const gr_player_skelleton_4 = 0x85;
const gr_player_skelleton_5 = 0x86;
const gr_wine_bottle = 0x87;
const gr_green_drop = 0x88;
const gr_red_drop = 0x89;
const gr_red_green_double_cross = 0x8a;
const gr_wide_laser_beam_vert = 0x8b;
const gr_wide_laser_beam_horiz = 0x8c;
const gr_green_double_dot = 0x8d;
const gr_grapes_1 = 0x8e;
const gr_grapes_2 = 0x8f;
const gr_trampoline_1 = 0x90;
const gr_trampoline_2 = 0x91;
const gr_fire_1 = 0x92;
const gr_fire_2 = 0x93;
const gr_fire_3 = 0x94;
const gr_fireball_horiz_1 = 0x95;
const gr_fireball_horiz_2 = 0x96;
const gr_fireball_diag_1 = 0x97;
const gr_fireball_diag_2 = 0x98;
const gr_devil_1 = 0x99;
const gr_devil_2 = 0x9a;
const gr_devilfork_1 = 0x9b;
const gr_devilfork_2 = 0x9c;
const gr_devilfork_3 = 0x9d;
const gr_dying_skell_1 = 0x9e;
const gr_dying_skell_2 = 0x9f;
const gr_dying_skell_3 = 0xa0;
const gr_bleeding_1 = 0xa1;
const gr_bleeding_2 = 0xa2;
const gr_bleeding_3 = 0xa3;
const gr_bleeding_4 = 0xa4;
const gr_bleeding_5 = 0xa5;
const gr_bleeding_6 = 0xa6;
const gr_bleeding_7 = 0xa7;
const gr_bleeding_8 = 0xa8;
const gr_green_waggon_chain_1 = 0xa9;
const gr_green_waggon_chain_2 = 0xaa;
const gr_waggon_1 = 0xab;
const gr_waggon_2 = 0xac;
const gr_rotating_blade_1 = 0xad;
const gr_rotating_blade_2 = 0xae;
const gr_big_red_blue_block = 0xaf;
const gr_little_blue_square = 0xb0;
const gr_green_top_device = 0xb1;
const gr_wine_funnel = 0xb2;
const gr_wine_box_left = 0xb3;
const gr_wine_box_right = 0xb4;
const gr_wine_box_top_left = 0xb5;
const gr_wine_box_top_right = 0xb6;
const gr_green_player_dirt_1 = 0xb7;
const gr_green_player_dirt_2 = 0xb8;
const gr_green_player_dirt_3 = 0xb9;
const gr_green_player_dirt_4 = 0xba;
const gr_green_player_dirt_5 = 0xbb;
const gr_player_walking_left_up = 0xbc;
const gr_player_walking_right_up = 0xbd;
const gr_red_blob_1 = 0xbe;
const gr_red_blob_2 = 0xbf;
const gr_red_blob_3 = 0xc0;
const gr_red_animal_front = 0xc1;
const gr_red_animal_left_1 = 0xc2;
const gr_red_animal_left_2 = 0xc3;
const gr_red_animal_right_1 = 0xc4;
const gr_red_animal_right_2 = 0xc5;
const gr_dragon_1 = 0xc6;
const gr_dragon_2 = 0xc7;
const gr_dragon_3 = 0xc8;
const gr_red_cave_wall_1a = 0xc9;
const gr_red_cave_wall_1b = 0xca;
const gr_red_cave_wall_1c = 0xcb;
const gr_red_cave_wall_1d = 0xcc;
const gr_blue_green_brick = 0xcd;
const gr_colored_square = 0xce;
const gr_two_sines = 0xcf;
const gr_little_red_triangle_bottom = 0xd0;
const gr_little_laser_pod_right = 0xd1;
const gr_loriciels_logo = 0xd2;
const gr_infernal = 0xd3;
const gr_runner = 0xd4;
const gr_par_eric_chahi = 0xd5;
const gr_musique_de_michel_wingradof = 0xd6;
const gr_c_loriels_85 = 0xd7;


const obj_player = 0;
const obj_auxiliary = 1;
const obj_pod_1 = 2;
const obj_pod_2 = 3;
const obj_pod_3 = 4;
const obj_pod_4 = 5;
const obj_pod_5 = 6;
const obj_pod_6 = 7;
const obj_double_flame_1 = 8;
const obj_double_flame_2 = 9;
const obj_conveyor_head_right_1 = 10;
const obj_conveyor_head_right_2 = 11;
const obj_conveyor_head_right_3 = 12;
const obj_conveyor_head_right_4 = 13;
const obj_conveyor_head_right_5 = 14;
const obj_conveyor_head_left_1 = 15;
const obj_conveyor_head_left_2 = 16;
const obj_conveyor_head_left_3 = 17;
const obj_red_animal_1 = 18;
const obj_red_animal_2 = 19;
const obj_dragon = 20;
const obj_snake = 21;
const obj_horizontal_flame = 22;
const obj_waggon = 23;
const obj_wine_bottle_1 = 24;
const obj_grape_1 = 25;
const obj_grape_2 = 26;
const obj_grape_3 = 27;
const obj_grape_4 = 28;
const obj_grape_5 = 29;
const obj_press_1 = 31;
const obj_thorns = 32;
const obj_press_2 = 34;
const obj_press_3 = 35;
const obj_fire = 36;
const obj_devil_fork = 37;
const obj_fireball_1 = 38;
const obj_fireball_2 = 39;
const obj_wine_bottle_2 = 40;

// Yield values
const pause = 1;
const exit = 2;
const land = 3;




















































































































































































































