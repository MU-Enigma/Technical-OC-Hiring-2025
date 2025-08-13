#include "vga.h"

volatile uint16_t* vga_buffer = (uint16_t*)0xB8000;
uint8_t vga_color = 0x0F; // white on black

void vga_print(const char* str) {
    for (size_t i = 0; str[i] != 0; i++) {
        vga_buffer[i] = (uint16_t)str[i] | (uint16_t)vga_color << 8;
    }
}

