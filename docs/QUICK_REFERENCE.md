# 🎯 Pensieve Play Store Submission - Quick Reference

**Status**: 🚧 In Progress
**Target**: Q4 2025
**Progress**: 8/25 tasks completed

## 📋 Current Critical Issues

### ✅ COMPLETED (Foundation Phase)
1. **App Package Name**: Updated to `com.pensieve.app` ✅
2. **Professional App Icon**: Created Pensieve-themed icon set with dark/light/splash variants ✅
3. **Privacy Policy**: Created and hosted with real contact info ✅
4. **Terms of Service**: Created with age restrictions and hosted online ✅
5. **Android Permissions**: Fixed overly broad storage permissions ✅
6. **Store Content**: Written comprehensive app descriptions ✅
7. **Contact Information**: Updated with real email and website URLs ✅

### ✅ COMPLETED (Store Assets Phase)
8. **Store Screenshots**: Created 8 high-quality screenshots (Home, Create, Review, Explore, RSS Feed) with dark/light modes ✅

### ❌ REMAINING (External Tasks)
1. **Feature Graphic**: Design 1024x500px feature graphic

## 🚀 Next Immediate Actions

### ✅ FOUNDATION COMPLETE - External Tasks Next
- [x] Update `app.json` package name from `com.anonymous.microjournal` to `com.pensieve.app` ✅
- [x] Fix app name consistency (Pensieve vs MicroJournal) ✅

### Day 1-2 (Priority 2)
- [x] Create professional Pensieve-themed app icon (512x512px) ✅
- [x] Generate all required icon sizes for Android ✅

### Day 3-5 (Priority 3)
- [x] Write and publish Privacy Policy ✅
- [x] Write Terms of Service ✅
- [x] Host both documents online ✅

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
- [x] Update app identity and configuration ✅
- [x] Create professional app icon ✅
- [x] Create legal documents ✅
- [x] Fix permissions ✅

### Week 2: Assets
- [x] Create store screenshots ✅
- Design feature graphic
- [x] Write app descriptions ✅

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

- [x] Professional app icon created
- [x] Privacy Policy hosted online
- [x] Terms of Service created
- [x] Store screenshots ready
- [ ] Feature graphic designed
- [ ] EAS builds configured
- [ ] Developer account created
- [ ] App submitted to Play Store

**Remember**: Google Play Store review takes 7+ days. Plan your timeline accordingly!

## 📧 Contact Information Status

✅ **COMPLETED**: All contact information has been updated with real details:

### Files Updated:
- `docs/store-listing-content.md` - ✅ Updated with real contact info
- `docs/privacy-policy/final-policy.md` - ✅ Updated to pensieve.journal@proton.me
- `docs/legal/terms-of-service.md` - ✅ Updated to pensieve.journal@proton.me

### Current Contact Info:
- **Real Email Address**: pensieve.journal@proton.me
- **Website URL**: https://adleyjulian.github.io/MicroJournal/
- **Privacy Policy URL**: https://adleyjulian.github.io/MicroJournal/privacy-policy.html
- **Terms of Service URL**: https://adleyjulian.github.io/MicroJournal/terms-of-service.html

**Note**: Contact information is ready for Play Store submission!
