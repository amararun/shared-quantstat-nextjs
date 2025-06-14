# Project Structure - AI Chat App

## 🚨 IMPORTANT FOR AI CODERS
This document clarifies which files are ACTIVE vs UNUSED to prevent confusion.

## ✅ ACTIVE STRUCTURE (What the live app uses)

### **Main App Directory**
```
/app/                          # ← LIVE APP USES THIS
├── layout.tsx                 # Main layout with TopNavigation
├── page.tsx                   # Home page imports Chat component  
├── globals.css                # Global styles
└── api/
    └── chat/
        └── route.ts           # API endpoint for chat
```

### **Components (Active)**
```
/src/components/
├── chat.tsx                   # ← MAIN CHAT COMPONENT (edited here!)
├── TopNavigation.tsx          # Shows "REX Portfolio Agent" title + buttons
├── footer.tsx                 # Simple footer with links (no unnecessary props)
└── ui/                        # UI library components (buttons, inputs, etc.)
```

### **Other Active Directories**
```
/src/
├── providers/                 # LogProvider for state management
├── lib/                       # Utilities and services
├── types/                     # TypeScript type definitions
└── hooks/                     # Custom React hooks
```

## 🗑️ CLEANED UP (Removed duplicates)

### **Removed Unused App Structure**
- ❌ `src/app/` - Was duplicate Next.js app router structure (REMOVED)

### **Removed Unused Components**
- ❌ `src/components/chat-interface.tsx` - Duplicate chat component (REMOVED)
- ❌ `src/components/MainPage.tsx` - Unused page component (REMOVED)
- ❌ `src/components/header.tsx` - Empty header component (REMOVED)
- ❌ `src/components/weather.tsx` - Unused weather component (REMOVED)
- ❌ `src/components/log-debug-display.tsx` - Unused log component (REMOVED)
- ❌ `src/components/log-display.tsx` - Unused log component (REMOVED)
- ❌ `src/components/header-footer/app-header.tsx` - Unused header (REMOVED)
- ❌ `src/components/header-footer/app-header.tsx.new` - Empty file (REMOVED)
- ❌ `src/components/header-footer/app-footer.tsx` - Replaced with simpler footer.tsx (REMOVED)
- ❌ `src/components/header-footer/` - Empty directory (REMOVED)
- ❌ `src/components/cards/` - Unused card components (aboutcard, envcard, genuicard) (REMOVED)
- ❌ `src/components/logs/` - Unused log display components (REMOVED)
- ❌ `app.bak/` - Old backup directory (REMOVED)

## 🎯 KEY FACTS FOR AI CODERS

1. **Main Chat Component**: Always edit `/src/components/chat.tsx`
2. **Live App Layout**: Uses `/app/layout.tsx` (not src/app)  
3. **TopNavigation**: Shows "REX Portfolio Agent" title + action buttons (no separate header)
4. **Footer**: Simple `footer.tsx` component (no unnecessary props)
4. **API Endpoint**: `/app/api/chat/route.ts`
5. **Imports**: Both app structures import from `@/components/chat`

## 🔄 Import Mapping
```typescript
// This import works from both app structures:
import Chat from '@/components/chat';  // ← Always use this component
```

## 📝 Notes
- The app.bak/ directory contains backups
- docs/ directory contains documentation and examples
- Only edit components that are actually imported and used
- Check imports before editing to avoid working on unused files

---
**Last Updated**: After cleanup to remove duplicate/unused files
**Purpose**: Prevent AI assistant confusion about which files are active 