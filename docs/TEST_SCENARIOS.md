# Pensieve Test Scenarios

**App Version**: 1.0.1
**Test Date**: December 19, 2024
**Tester**: Adley
**Device**: Pixel 6 Emulator (Android API 34)

## 📝 Test Scenarios

### Scenario 1: First Time User Experience
**Goal**: Verify new user can create their first entry and understand the app

1. **Install and Launch**
   - [ ] App installs successfully
   - [ ] App launches without errors
   - [ ] Permissions requested appropriately (storage, etc.)

2. **Onboarding Experience**
   - [ ] Welcome screen appears
   - [ ] Navigation is intuitive
   - [ ] Can access all main tabs (Home, Create, Review, Explore)

3. **Create First Entry**
   - [ ] Tap "Create" or "+" button
   - [ ] Enter title and content
   - [ ] Save entry successfully
   - [ ] Entry appears in home view

4. **Review System Introduction**
   - [ ] Entry appears in review queue
   - [ ] Can rate entry (Again, Hard, Good, Easy)
   - [ ] Rating affects future scheduling

**Result**: [Pass/Fail/Issues]

---

### Scenario 2: Daily Journaling Workflow
**Goal**: Test complete daily usage flow

1. **Morning Routine**
   - [ ] Open app and see today's entries
   - [ ] Create new entry for morning reflection
   - [ ] Add photo or media if available
   - [ ] Use tags for organization

2. **Review Session**
   - [ ] Navigate to Review tab
   - [ ] See entries due for review
   - [ ] Review and rate multiple entries
   - [ ] Check review progress

3. **Calendar Exploration**
   - [ ] Go to Calendar/Explore tab
   - [ ] See entries visualized on calendar
   - [ ] Tap on past dates to view entries
   - [ ] Navigate between months

4. **News Integration**
   - [ ] Check news feed (if internet available)
   - [ ] Create entry inspired by news article
   - [ ] Save news-related reflection

**Result**: [Pass/Fail/Issues]

---

### Scenario 3: Dark/Light Mode Testing
**Goal**: Verify theme switching works across all screens

1. **Auto Theme Detection**
   - [ ] App follows system theme by default
   - [ ] Changes when system theme changes

2. **Manual Theme Toggle**
   - [ ] Find theme toggle in settings
   - [ ] Switch between light and dark
   - [ ] All screens adapt correctly

3. **Theme Consistency**
   - [ ] Text colors appropriate for background
   - [ ] Icons change color appropriately
   - [ ] Status bar adapts
   - [ ] No visual artifacts or glitches

4. **Theme Persistence**
   - [ ] Theme choice remembered after restart
   - [ ] Theme applies immediately

**Result**: [Pass/Fail/Issues]

---

### Scenario 4: Offline Functionality
**Goal**: Test app behavior without internet

1. **App Launch Offline**
   - [ ] App opens without internet
   - [ ] All local data accessible
   - [ ] No crashes or errors

2. **Core Features Offline**
   - [ ] Create new entries
   - [ ] Edit existing entries
   - [ ] Review due entries
   - [ ] Access calendar view
   - [ ] Export data

3. **News Feed Offline**
   - [ ] Previously loaded news accessible
   - [ ] Graceful handling of no internet
   - [ ] No crashes when trying to refresh

4. **Network Recovery**
   - [ ] App handles reconnection gracefully
   - [ ] New data syncs when available
   - [ ] No data loss

**Result**: [Pass/Fail/Issues]

---

### Scenario 5: Data Management
**Goal**: Test import/export and data integrity

1. **Export Functionality**
   - [ ] Export to JSON format
   - [ ] Export to CSV format
   - [ ] File saved to device storage
   - [ ] File contains all entry data

2. **Import Functionality**
   - [ ] Import JSON file
   - [ ] Import CSV file
   - [ ] Data imports correctly
   - [ ] No duplicate entries created

3. **Data Integrity**
   - [ ] All entries preserved
   - [ ] Tags and categories maintained
   - [ ] Media attachments preserved
   - [ ] Review history intact

4. **Backup/Restore**
   - [ ] Complete data backup works
   - [ ] Restore from backup works
   - [ ] No data corruption

**Result**: [Pass/Fail/Issues]

---

### Scenario 6: Edge Cases & Error Handling
**Goal**: Test app behavior in unusual situations

1. **Large Content**
   - [ ] Very long text entries (>1000 words)
   - [ ] Multiple large images
   - [ ] Many entries (>100)
   - [ ] Performance remains acceptable

2. **Error Conditions**
   - [ ] Network timeouts handled gracefully
   - [ ] Storage full scenarios
   - [ ] Invalid data handling
   - [ ] App restart scenarios

3. **Device Specific**
   - [ ] Orientation changes
   - [ ] Background/foreground transitions
   - [ ] Low memory conditions
   - [ ] Battery optimization

4. **Input Validation**
   - [ ] Empty entry handling
   - [ ] Special characters in text
   - [ ] Very long titles
   - [ ] Invalid file formats

**Result**: [Pass/Fail/Issues]

---

### Scenario 7: Performance Testing
**Goal**: Verify app performance is acceptable

1. **Loading Performance**
   - [ ] App launches within 3 seconds
   - [ ] Screens load within 2 seconds
   - [ ] No long loading spinners

2. **Interaction Performance**
   - [ ] Smooth scrolling through entries
   - [ ] Quick response to button taps
   - [ ] Fast text input
   - [ ] Smooth animations

3. **Memory Usage**
   - [ ] No memory leaks detected
   - [ ] Reasonable memory consumption
   - [ ] App doesn't force close on low memory

4. **Battery Usage**
   - [ ] Reasonable battery drain
   - [ ] No excessive background activity
   - [ ] Optimized for battery life

**Result**: [Pass/Fail/Issues]

---

## 📱 Device-Specific Test Results

### Device 1: [Device Name]
- **Android Version**: [API Level]
- **Screen Size**: [Width x Height]
- **Test Date**: [Date]

**Installation**: [Success/Failed/Issues]
**Core Features**: [All Pass/Partial/Failed]
**Dark/Light Mode**: [Working/Issues]
**Offline**: [Working/Issues]
**Performance**: [Good/Acceptable/Issues]

**Issues Found**:
- [List any issues]

---

### Device 2: [Device Name]
- **Android Version**: [API Level]
- **Screen Size**: [Width x Height]
- **Test Date**: [Date]

**Installation**: [Success/Failed/Issues]
**Core Features**: [All Pass/Partial/Failed]
**Dark/Light Mode**: [Working/Issues]
**Offline**: [Working/Issues]
**Performance**: [Good/Acceptable/Issues]

**Issues Found**:
- [List any issues]

---

### Device 3: [Device Name]
- **Android Version**: [API Level]
- **Screen Size**: [Width x Height]
- **Test Date**: [Date]

**Installation**: [Success/Failed/Issues]
**Core Features**: [All Pass/Partial/Failed]
**Dark/Light Mode**: [Working/Issues]
**Offline**: [Working/Issues]
**Performance**: [Good/Acceptable/Issues]

**Issues Found**:
- [List any issues]

---

## 📊 Overall Test Results

**Total Scenarios Tested**: [Number]
**Passed**: [Number]
**Failed**: [Number]
**Issues Requiring Fix**: [Number]

### Critical Issues (Must Fix):
- [List critical issues that prevent Play Store submission]

### High Priority Issues:
- [List high priority issues]

### Medium/Low Priority Issues:
- [List less critical issues]

### Ready for Play Store Submission:
- [ ] Yes
- [ ] No (list remaining issues)

**Tester Signature**: ____________________
**Date**: ____________________

---

## 🛠️ Quick Commands for Testing

### Build Development Version:
```bash
eas build --platform android --profile development
```

### Build Preview Version:
```bash
eas build --platform android --profile preview
```

### Install on Device:
```bash
npx expo run:android --device
```

### Run Automated Tests:
```bash
npm test
```

### Check Device Logs (if issues occur):
```bash
adb logcat --pid=$(adb shell pidof -s com.pensieve.app)
```

---

## 📞 Need Help?

If you encounter issues during testing:

1. **Take screenshots** of any bugs or crashes
2. **Note the exact steps** to reproduce the issue
3. **Record device information** (Android version, device model)
4. **Check the troubleshooting section** in DEVICE_TESTING_GUIDE.md
5. **Document everything** in this file for reference

Remember: The goal is to ensure your app works reliably for users before submitting to the Play Store!
