# 🎯 Pensieve Play Store Submission - Quick Reference

**Status**: 🚧 In Progress
**Target**: Q1 2025
**Progress**: 0/25 tasks completed

## 📋 Current Critical Issues

### ❌ MUST FIX (Showstoppers)
1. **App Package Name**: `com.anonymous.microjournal` → `com.pensieve.app`
2. **Missing Privacy Policy**: Required by Google Play
3. **Missing Terms of Service**: Required for data apps
4. **Placeholder App Icon**: Using React logo
5. **No Store Screenshots**: Required 2-8 screenshots
6. **No Feature Graphic**: Required 1024x500px
7. **Overly Broad Permissions**: Need to fix Android storage permissions

## 🚀 Next Immediate Actions

### Today (Priority 1)
- [ ] Update `app.json` package name from `com.anonymous.microjournal` to `com.pensieve.app`
- [ ] Fix app name consistency (Pensieve vs MicroJournal)

### Day 1-2 (Priority 2)
- [ ] Create professional Pensieve-themed app icon (512x512px)
- [ ] Generate all required icon sizes for Android

### Day 3-5 (Priority 3)
- [ ] Write and publish Privacy Policy
- [ ] Write Terms of Service
- [ ] Host both documents online

## 📁 File Structure Created

```
docs/
├── PLAY_STORE_READINESS.md     # Complete guide
├── TODO_PLAY_STORE.json        # Machine-readable tasks
├── QUICK_REFERENCE.md         # This file
├── privacy-policy/
│   └── template.md            # Privacy policy template
└── legal/                     # Future legal documents
```

## 🔗 Key Files to Update

### 1. app.json
```json
{
  "expo": {
    "name": "Pensieve",
    "slug": "pensieve",
    "android": {
      "package": "com.pensieve.app"
    }
  }
}
```

### 2. AndroidManifest.xml
- Remove: `WRITE_EXTERNAL_STORAGE` permission
- Remove: `READ_EXTERNAL_STORAGE` permission
- Add: Specific gallery and file system permissions

### 3. eas.json
- Configure production builds
- Set up app signing

## 💰 Budget Estimate

| Item | Cost | Timeline |
|------|------|----------|
| Google Play Developer Account | $25 | One-time |
| Professional App Icons | $50-150 | One-time |
| Domain for Privacy Policy | $10-15 | Annual |
| **Total** | **$85-190** | One-time + annual |

## 📅 Timeline

### Week 1-2: Foundation
- Update app identity and configuration
- Create legal documents
- Fix permissions

### Week 2: Assets
- Create store screenshots
- Design feature graphic
- Write app descriptions

### Week 3: Technical
- Configure EAS builds
- Device testing
- Pre-launch validation

### Week 4: Submission
- Create developer account
- Complete store listing
- Submit for review

## 🔍 Common Rejection Reasons

1. **Missing Privacy Policy** - Most common rejection
2. **Overly Broad Permissions** - Will be rejected
3. **Placeholder Content** - Generic descriptions rejected
4. **Poor Quality Assets** - Must be professional
5. **Non-functional Features** - App must work completely

## 📞 Quick Links

- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Privacy Policy Generator](https://www.privacypolicytemplate.net/)
- [App Icon Generator](https://appicon.co/)

## 🎯 Success Checklist

- [ ] Professional app icon created
- [ ] Privacy Policy hosted online
- [ ] Terms of Service created
- [ ] Store screenshots ready
- [ ] Feature graphic designed
- [ ] EAS builds configured
- [ ] Developer account created
- [ ] App submitted to Play Store

**Remember**: Google Play Store review takes 7+ days. Plan your timeline accordingly!
