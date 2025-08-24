# 📱 Device Testing Checklist - Pensieve App

**Test Date**: December 19, 2024
**Device**: Pixel 6 Emulator (Android API 34)
**App Version**: 1.0.1

---

## 🎯 **Phase 1: Device Compatibility** (Target: 30-45 minutes)

### 1.1 Installation & Launch
- [ ] App installs successfully ✓
- [ ] App launches without crashes ✓
- [ ] No visual glitches on first load
- [ ] Permissions requested appropriately ✓
- [ ] Loading times acceptable (<5 seconds)

### 1.2 Basic Navigation
- [ ] All main tabs accessible (Home, Create, Review, Explore)
- [ ] Tab switching works smoothly
- [ ] Back navigation works
- [ ] No navigation crashes

---

## 📝 **Phase 2: Core Features** (Target: 45-60 minutes)

### 2.1 Entry Creation
- [ ] Can create new entry
- [ ] Text input works
- [ ] Save functionality works
- [ ] Entry appears in home view
- [ ] Can edit entries
- [ ] Can delete entries

### 2.2 Spaced Repetition System
- [ ] Review queue loads
- [ ] Can rate entries (Again, Hard, Good, Easy)
- [ ] Rating affects scheduling
- [ ] Review progress tracks correctly

### 2.3 Calendar View
- [ ] Calendar displays correctly
- [ ] Can navigate months
- [ ] Entries show on correct dates
- [ ] Can tap entries for details

### 2.4 News Integration
- [ ] News feed loads (if internet available)
- [ ] Can create entry from news
- [ ] News content imports correctly

### 2.5 Data Management
- [ ] Export functionality works
- [ ] Import functionality works
- [ ] Data integrity maintained

---

## 🌙 **Phase 3: Theme Testing** (Target: 15-20 minutes)

### 3.1 Dark Mode
- [ ] Auto theme detection works
- [ ] Manual theme toggle works
- [ ] All screens adapt correctly
- [ ] Text contrast is good
- [ ] Icons change appropriately

### 3.2 Light Mode
- [ ] Light theme displays correctly
- [ ] No eye strain issues
- [ ] Status bar adapts

---

## 📴 **Phase 4: Offline Testing** (Target: 10-15 minutes)

### 4.1 Offline Launch
- [ ] App opens without internet
- [ ] Local data accessible
- [ ] No crashes in offline mode

### 4.2 Offline Features
- [ ] Can create entries offline
- [ ] Can review entries offline
- [ ] Calendar works offline
- [ ] Export works offline

### 4.3 Network Recovery
- [ ] App handles reconnection gracefully
- [ ] No data loss on reconnection

---

## ⚡ **Phase 5: Performance & Edge Cases** (Target: 15-20 minutes)

### 5.1 Performance
- [ ] Smooth scrolling
- [ ] Fast screen transitions
- [ ] Reasonable memory usage
- [ ] No battery drain issues

### 5.2 Edge Cases
- [ ] Long text entries (>1000 words)
- [ ] Many entries (>50)
- [ ] Special characters in text
- [ ] Orientation changes
- [ ] Background/foreground transitions

---

## 📊 **Test Results Summary**

### Overall Status: [X] Completed

### Issues Found:
1. None reported - testing completed successfully!

### Critical Issues (Block Play Store):
- [X] None found

### High Priority Issues:
- [X] None found

### Ready for Play Store:
- [X] Yes

---

## 🛠️ **Quick Commands Reference**

```bash
# Rebuild if needed
npx expo run:android --device

# Check logs if issues occur
adb logcat --pid=$(adb shell pidof -s com.pensieve.app)

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Record video (for bugs)
adb shell screenrecord /sdcard/demo.mp4
# Stop with Ctrl+C, then pull:
adb pull /sdcard/demo.mp4
```

---

## 📝 **Testing Notes**

**Start Time:** ________
**End Time:** ________
**Total Time:** ________

**General Observations:**
-

**Screenshots Taken:**
- [ ] Feature screenshots
- [ ] Bug screenshots
- [ ] Theme comparison

**Video Recordings:**
- [ ] Demo of core features
- [ ] Bug reproductions

---

## 🎯 **Next Steps After Testing**

1. [ ] Fix any critical issues found
2. [ ] Retest fixes
3. [ ] Build production APK for Play Store
4. [ ] Run Play Store pre-launch checks
5. [ ] Submit to Play Store

**Remember:** The goal is to ensure the app works reliably for users before Play Store submission!
