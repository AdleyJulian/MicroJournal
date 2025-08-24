# Device Testing Guide for Pensieve

**Last Updated**: December 19, 2024
**Target**: Comprehensive device testing before Play Store submission
**Estimated Time**: 8 hours

## 📋 Testing Requirements Overview

Based on Play Store requirements, test the following:
- [ ] Android API 21+ compatibility
- [ ] Different screen sizes (phones, tablets)
- [ ] Dark/Light mode functionality
- [ ] Offline functionality
- [ ] All core features

---

## 🔧 Testing Environment Setup

### 1. Physical Device Requirements

#### Minimum Test Devices:
- **Phone (Small)**: API 21-23 (Android 5.0-6.0)
- **Phone (Medium)**: API 24-26 (Android 7.0-8.0)
- **Phone (Large)**: API 27+ (Android 8.1+)
- **Tablet**: Any tablet device (if supporting tablets)

#### Recommended Devices:
- Google Pixel 4a (Android 11-13)
- Samsung Galaxy A52 (Android 11-13)
- Google Pixel 6 (Android 13+)
- Physical tablet (optional)

### 2. Development Setup

#### Install Development Tools:
```bash
# Install Expo CLI (if not already installed)
npm install -g @expo/cli

# Install EAS CLI (for production builds)
npm install -g @expo/eas-cli

# Login to Expo
expo login
```

#### Build Test Versions:
```bash
# Create development build for testing
eas build --platform android --profile development

# Create preview build (release build)
eas build --platform android --profile preview
```

### 3. Testing App Installation

#### Option A: Development Build (Recommended for testing)
```bash
# Install development build on connected device
npx expo run:android --device

# Or with EAS
eas build --platform android --profile development
```

#### Option B: Preview Build (Production-like testing)
```bash
eas build --platform android --profile preview
```

---

## 📱 Device Testing Checklist

### Phase 1: Device Compatibility (2 hours)

#### 1.1 Android Version Testing

**Test on each Android version:**
- [ ] API 21-23 (Android 5.0-6.0) - **CRITICAL**
- [ ] API 24-26 (Android 7.0-8.0) - **CRITICAL**
- [ ] API 27+ (Android 8.1+) - **CRITICAL**

**For each device:**
- [ ] App installs successfully
- [ ] App launches without crashes
- [ ] Basic navigation works
- [ ] No visual glitches or layout issues

#### 1.2 Screen Size Testing

**Phone Sizes:**
- [ ] Small phones (320-360dp width)
- [ ] Medium phones (360-420dp width)
- [ ] Large phones (420+dp width)

**Tablet Testing (if supported):**
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Responsive layouts

### Phase 2: Feature Testing (3 hours)

#### 2.1 Core Features Test

**Journal Entry Creation:**
- [ ] Create text entry
- [ ] Add images/media
- [ ] Use tags and categories
- [ ] Save and edit entries
- [ ] Delete entries

**Spaced Repetition System:**
- [ ] Review queue shows correct entries
- [ ] Rating system (Again, Hard, Good, Easy)
- [ ] FSRS algorithm scheduling
- [ ] Review progress tracking

**Calendar View:**
- [ ] Monthly calendar display
- [ ] Entry visualization
- [ ] Date navigation
- [ ] Entry details on tap

**News Integration:**
- [ ] RSS feed loading
- [ ] Create entry from news article
- [ ] News feed refresh
- [ ] Offline news handling

**Data Management:**
- [ ] Export to JSON/CSV
- [ ] Import functionality
- [ ] Data backup and restore
- [ ] File permissions

#### 2.2 UI/UX Testing

**Navigation:**
- [ ] Tab navigation works
- [ ] Drawer menu (if applicable)
- [ ] Back navigation
- [ ] Deep linking

**Forms and Inputs:**
- [ ] Text input validation
- [ ] Image picker functionality
- [ ] Date/time pickers
- [ ] Form submission

**Visual Elements:**
- [ ] Icons and images load
- [ ] Animations work smoothly
- [ ] No overlapping text
- [ ] Touch targets are adequate

### Phase 3: Theme & Offline Testing (2 hours)

#### 3.1 Dark/Light Mode Testing

**Theme Switching:**
- [ ] Auto theme detection works
- [ ] Manual theme toggle works
- [ ] All screens adapt correctly
- [ ] Icons and colors change appropriately
- [ ] Text contrast is sufficient
- [ ] No visual artifacts

**Dark Mode Specific:**
- [ ] Dark backgrounds don't cause eye strain
- [ ] Light text is readable
- [ ] Status bar adapts
- [ ] System UI integration

**Light Mode Specific:**
- [ ] Light backgrounds are comfortable
- [ ] Dark text is readable
- [ ] High contrast elements

#### 3.2 Offline Functionality Testing

**Offline Features:**
- [ ] App launches without internet
- [ ] Local data is accessible
- [ ] Previously loaded content works
- [ ] No crashes when offline
- [ ] Graceful error handling

**Network Recovery:**
- [ ] App handles network restoration
- [ ] Data syncs when reconnected
- [ ] No data loss on reconnection

### Phase 4: Performance & Edge Cases (1 hour)

#### 4.1 Performance Testing

**App Performance:**
- [ ] Smooth scrolling
- [ ] Fast loading times
- [ ] Memory usage reasonable
- [ ] No excessive battery drain
- [ ] Background operation

**Storage Testing:**
- [ ] Large number of entries (>100)
- [ ] Large media files
- [ ] Storage space warnings
- [ ] Data migration

#### 4.2 Edge Cases

**Error Handling:**
- [ ] Network timeouts
- [ ] Storage full scenarios
- [ ] App restart scenarios
- [ ] Background/foreground transitions
- [ ] Orientation changes

**Data Edge Cases:**
- [ ] Empty states
- [ ] Very long text entries
- [ ] Special characters
- [ ] Large images

---

## 🧪 Testing Tools & Methods

### Manual Testing Process

#### Test Script Template:
```markdown
Device: [Device Name]
Android Version: [API Level]
Screen Size: [Width x Height]
Date: [Date]

## Test Results

### Installation
- [ ] Installs successfully
- [ ] Launches without errors
- [ ] Permissions requested appropriately

### Core Features
- [ ] Entry creation works
- [ ] Review system functions
- [ ] Calendar view loads
- [ ] News integration works
- [ ] Export/Import functions

### UI/UX
- [ ] Layout adapts to screen
- [ ] Dark/Light mode works
- [ ] Touch interactions work
- [ ] Visual elements load

### Performance
- [ ] No crashes
- [ ] Smooth performance
- [ ] Reasonable battery usage

### Issues Found
- List any bugs or issues discovered
```

### Automated Testing

#### Run Existing Tests:
```bash
# Run Jest tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test files
npm test -- __tests__/ThemedText-test.tsx
```

#### Add Device-Specific Tests:
Consider adding tests for:
- Screen size compatibility
- Theme switching logic
- Offline data handling
- FSRS algorithm accuracy

---

## 📊 Test Results Documentation

### Bug Tracking Template:
```markdown
## Bug Report

**Bug ID**: [Auto-increment]

**Device Info:**
- Device: [Device Name]
- Android: [Version]
- Screen: [Size]
- App Version: [Version]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Severity:** [Critical/High/Medium/Low]

**Screenshot/Video:**
[Attach if applicable]

**Additional Notes:**
[Any other relevant information]
```

### Test Summary Report:
```markdown
## Device Testing Summary Report

**Test Period:** [Start Date] - [End Date]
**Tester:** [Name]
**App Version:** [Version]

### Devices Tested:
1. [Device 1] - [Android Version] - [Pass/Fail]
2. [Device 2] - [Android Version] - [Pass/Fail]
3. [Device 3] - [Android Version] - [Pass/Fail]

### Overall Results:
- **Total Tests:** [Number]
- **Passed:** [Number]
- **Failed:** [Number]
- **Blocked:** [Number]

### Critical Issues Found:
- [List any critical issues that must be fixed]

### Recommendations:
- [Any recommendations for improvement]

### Ready for Play Store:
- [ ] Yes
- [ ] No (with reasons)
```

---

## 🚀 Quick Start Testing Guide

### For Beginners:

1. **Set up one test device** (your personal phone)
2. **Install development build:**
   ```bash
   eas build --platform android --profile development
   ```
3. **Follow the Device Testing Checklist** above
4. **Test all core features** mentioned in Phase 2
5. **Verify dark/light mode** works
6. **Test offline functionality**

### For Advanced Testers:

1. **Set up multiple devices** (different Android versions)
2. **Create test scenarios** for edge cases
3. **Use automated testing** where possible
4. **Document all findings** with screenshots
5. **Create bug reports** for any issues found

---

## 📞 Troubleshooting Common Issues

### App Won't Install:
- Check minimum Android version (API 21)
- Verify device storage space
- Check for conflicting apps

### App Crashes on Launch:
- Check device logs: `adb logcat`
- Verify all required permissions
- Check for missing resources

### Layout Issues:
- Test different screen densities
- Check responsive design breakpoints
- Verify tablet layouts if supported

### Performance Issues:
- Monitor memory usage
- Check for memory leaks
- Optimize image loading
- Reduce bundle size if needed

---

## ⏱️ Time Management

### 8-Hour Testing Schedule:
- **Hours 1-2**: Setup and Android version testing
- **Hours 3-5**: Core feature testing
- **Hours 6-7**: Theme and offline testing
- **Hour 8**: Performance testing and documentation

### Tips for Efficiency:
- Start with your primary device
- Use screen recording for documentation
- Take screenshots of issues immediately
- Test critical features first
- Document as you go

---

## 🎯 Success Criteria

Your app is ready for Play Store when:

✅ **All devices tested pass:**
- App installs and launches successfully
- Core features work as expected
- No critical crashes or bugs
- Dark/light mode works correctly
- Offline functionality works
- Performance is acceptable

✅ **Documentation complete:**
- Test results documented
- Any bugs reported and fixed
- Screenshots taken of key features
- Ready for Play Store pre-launch checks

**Remember**: Google Play Store requires apps to work on Android API 21+ (Android 5.0+). Ensure you test on at least one device running API 21-23 for critical compatibility verification.
