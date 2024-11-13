#!/bin/bash

# Fix permissions for /dev/shm
sudo chmod 1777 /dev/shm

# Check if /dev/shm is mounted, if not, remount it
if ! df -h | grep -q "/dev/shm"; then
    echo "/dev/shm is not mounted. Mounting it now..."
    sudo mount -t tmpfs -o rw,nosuid,nodev,noexec,relatime,size=2G tmpfs /dev/shm
fi

# Recreate /dev/shm if necessary
if [ ! -d /dev/shm ]; then
    echo "/dev/shm does not exist. Creating it now..."
    sudo mkdir /dev/shm
    sudo chmod 1777 /dev/shm
fi

# Set TMPDIR environment variable for Electron
export TMPDIR=/tmp

# Check disk space and inode availability for /dev/shm
echo "Checking disk space and inode availability for /dev/shm..."
df -h /dev/shm
df -i /dev/shm

# Launch Electron with --no-sandbox option as a temporary workaround
echo "Launching Electron with --no-sandbox..."
electron --no-sandbox .
