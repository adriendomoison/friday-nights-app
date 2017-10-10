#!/usr/bin/env bash
cp FridayNights.keystore ./platforms/android/
cp google-services.json ./platforms/android/
cp release-signing.properties ./platforms/android/
ionic cordova run android --prod --release
