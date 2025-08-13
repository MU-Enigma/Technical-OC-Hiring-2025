BUILD_DIR = build
ISO_DIR = iso

all: $(BUILD_DIR)/kernel.elf

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/multiboot.o: $(BUILD_DIR) boot/multiboot.asm
	nasm -f elf32 boot/multiboot.asm -o $(BUILD_DIR)/multiboot.o

$(BUILD_DIR)/vga.o: $(BUILD_DIR) src/vga.c src/vga.h
	i686-elf-gcc -ffreestanding -O2 -Wall -Wextra -m32 -c src/vga.c -o $(BUILD_DIR)/vga.o

$(BUILD_DIR)/kernel.o: $(BUILD_DIR) src/kernel.c src/vga.h
	i686-elf-gcc -ffreestanding -O2 -Wall -Wextra -m32 -c src/kernel.c -o $(BUILD_DIR)/kernel.o

$(BUILD_DIR)/kernel.elf: $(BUILD_DIR)/multiboot.o $(BUILD_DIR)/vga.o $(BUILD_DIR)/kernel.o
	i686-elf-ld -T linker.ld -m elf_i386 -o $(BUILD_DIR)/kernel.elf $(BUILD_DIR)/multiboot.o $(BUILD_DIR)/vga.o $(BUILD_DIR)/kernel.o

os.iso: $(BUILD_DIR)/kernel.elf
	mkdir -p $(ISO_DIR)/boot/grub
	cp $(BUILD_DIR)/kernel.elf $(ISO_DIR)/boot/
	cp grub.cfg $(ISO_DIR)/boot/grub/
	grub-mkrescue -o os.iso $(ISO_DIR)

run: os.iso
	qemu-system-i386 -cdrom os.iso

clean:
	rm -rf $(BUILD_DIR) os.iso

