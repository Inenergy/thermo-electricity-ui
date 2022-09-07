cd "$( dirname "$0" )/.."

# MAIN APP INSTALLATION
npm i
npm run build

# MAIN APP AUTOSTART
chmod +x dist/thermo-electricity-ui*.AppImage
mkdir -p ~/inenergy-gui/dist
cp dist/thermo-electricity-ui*.AppImage ~/inenergy-gui/dist/
mkdir ~/.inenergy
echo '~/inengergy-gui/dist/thermo-electricity-ui*.AppImage > ~/.inenergy/thermo-electricity-ui.log' > ~/.config/openbox/autostart