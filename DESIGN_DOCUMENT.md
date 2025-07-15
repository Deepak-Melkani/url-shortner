# URL Shortener - Design Document

## Project Overview

A frontend-only React URL Shortener Web App that allows users to shorten URLs with optional expiry and custom shortcodes, displays analytics and click tracking, and implements robust logging without console logs.

## Architecture

### Framework & Technologies
- **React 18** with Vite for fast development and builds
- **React Router DOM** for client-side routing
- **ShadCN UI** with Tailwind CSS for consistent, modern styling
- **Lucide React** for icons
- **Local Storage** for data persistence
- **Custom Logging Middleware** for event tracking

### Project Structure
```
src/
├── components/
│   ├── ui/              # ShadCN UI components
│   └── Navigation.jsx   # Main navigation component
├── contexts/
│   └── URLContext.jsx   # React Context for state management
├── lib/
│   ├── logger.js        # Custom logging middleware
│   ├── urlService.js    # URL management service
│   └── utils.js         # ShadCN utilities
├── pages/
│   ├── URLShortener.jsx # Main shortening page
│   ├── Statistics.jsx   # Analytics dashboard
│   ├── RedirectHandler.jsx # URL redirection handler
│   └── NotFound.jsx     # 404 error page
├── App.jsx              # Main app component with routing
└── main.jsx             # React app entry point
```

## Core Features

### 1. URL Shortener Page (/)
**Components:** URLShortener.jsx
**Functionality:**
- Input form with validation for:
  - Original URL (required, URL format validation)
  - Optional expiry period (default 30 minutes, max 1 year)
  - Optional custom shortcode (3-20 alphanumeric characters)
- Real-time validation and error handling
- Immediate display of shortened URL with copy functionality
- Success feedback with URL details and expiry information

**Validation Rules:**
- URL must be valid HTTP/HTTPS format
- Custom shortcode must be unique and alphanumeric
- Expiry period must be between 1 minute and 525,600 minutes (1 year)

### 2. Statistics Page (/stats)
**Components:** Statistics.jsx
**Functionality:**
- Dashboard with aggregate statistics (total URLs, active URLs, expired URLs, total clicks)
- Comprehensive table showing all created URLs with:
  - Original URL (truncated with hover tooltip)
  - Short URL with copy functionality
  - Status badges (Active/Expired)
  - Click count with expandable analytics
  - Creation and expiry timestamps
  - Action buttons (external link, delete)
- Expandable click analytics showing:
  - Individual click timestamps
  - Simulated source and location data
  - Last 10 clicks with pagination indicator

### 3. Redirection Handler (/:shortcode)
**Components:** RedirectHandler.jsx
**Functionality:**
- Validates shortcode existence and expiry status
- Records click with metadata (timestamp, source, location)
- 3-second countdown with manual redirect option
- Graceful error handling for invalid/expired URLs
- User-friendly redirect interface with destination preview

## State Management Strategy

### React Context API
**URLContext.jsx** provides centralized state management with:
- `urls`: Array of all created URLs
- `stats`: Aggregate statistics object
- `loading`: Loading state for async operations
- Methods: `createShortUrl`, `deleteUrl`, `recordClick`, `getUrlByShortcode`, `refreshData`

**Benefits:**
- Avoids prop drilling
- Centralized state updates
- Automatic re-rendering of dependent components
- Easy integration with logging system

## Data Structure in localStorage

### URL Data Structure
```javascript
{
  "shortcode": {
    id: timestamp,
    originalUrl: "https://example.com/very-long-url",
    shortcode: "abc123",
    shortUrl: "http://localhost:3000/abc123",
    createdAt: 1703158800000,
    expiryAt: 1703160600000,
    expiryMinutes: 30,
    clickCount: 5,
    clickLogs: [
      {
        timestamp: 1703159000000,
        source: "Direct",
        location: "Mumbai, India",
        userAgent: "Mozilla/5.0..."
      }
    ]
  }
}
```

### Storage Keys
- `url_shortener_data`: Main URL data storage
- `url_shortener_logs`: Application logs storage

## Logging Implementation

### Custom Logger Class
**logger.js** implements comprehensive logging without console outputs:

**Features:**
- Structured log entries with timestamps and metadata
- Multiple log levels (info, warn, error, success)
- Persistent storage in localStorage
- Automatic log rotation (keeps last 1000 entries)
- Silent failure handling for storage issues

**Log Entry Structure:**
```javascript
{
  id: "unique_id",
  timestamp: "2023-12-21T10:30:00.000Z",
  level: "info",
  message: "URL shortened successfully",
  data: {
    shortcode: "abc123",
    originalUrl: "https://example.com",
    expiryMinutes: 30
  }
}
```

**Logged Events:**
- URL creation with parameters
- URL access and redirection
- Click recording with metadata
- Validation failures
- Data persistence operations
- Error conditions

## Routing Strategy

### React Router DOM Configuration
```javascript
<Routes>
  <Route path="/" element={<URLShortener />} />
  <Route path="/stats" element={<Statistics />} />
  <Route path="/:shortcode" element={<RedirectHandler />} />
</Routes>
```

**Design Decisions:**
- Clean URLs without hash routing
- Dynamic routing for shortcode handling
- Conditional navigation rendering (hidden on redirect pages)
- 404 handling for invalid routes

## Error Handling & Validation

### Client-Side Validation
1. **URL Validation:** Uses native URL constructor for format validation
2. **Shortcode Validation:** Regex pattern matching for alphanumeric characters
3. **Expiry Validation:** Range checking with reasonable limits
4. **Duplicate Prevention:** Real-time shortcode conflict detection

### Error States
- Form validation errors with field-specific messages
- Network/storage errors with user-friendly fallbacks
- URL not found/expired states with helpful alternatives
- Loading states for better user experience

### Graceful Degradation
- LocalStorage availability checking
- Silent failure modes for non-critical operations
- Fallback behaviors for missing data
- Progressive enhancement approach

## Security Considerations

### Client-Side Security
- Input sanitization for all user inputs
- XSS prevention through React's built-in escaping
- URL validation to prevent malicious redirects
- No sensitive data exposure in logs

### Data Privacy
- All data stored locally (no server transmission)
- User-controlled data deletion
- No personal information collection
- Simulated analytics data only

## Performance Optimizations

### React Optimizations
- Efficient re-rendering with proper key props
- Minimal state updates in context
- Lazy loading considerations for future enhancements
- Optimized bundle size with Vite

### Storage Optimizations
- Log rotation to prevent localStorage bloat
- Efficient data structures for quick lookups
- Minimal data serialization overhead
- Automatic cleanup of expired URLs (future enhancement)

## User Experience (UX) Design

### Design Principles
- Clean, uncluttered interface
- Immediate feedback for all actions
- Clear visual hierarchy with proper spacing
- Consistent interaction patterns
- Mobile-responsive design

### Accessibility Features
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast color scheme
- Screen reader compatibility

## Future Enhancement Opportunities

### Scalability
- Database integration for persistent storage
- User authentication and personal dashboards
- Bulk URL operations
- Advanced analytics with charts

### Feature Additions
- QR code generation for shortened URLs
- Custom domains support
- URL preview before redirect
- Export functionality for analytics data
- Password protection for URLs

### Performance
- Service worker for offline functionality
- Progressive Web App (PWA) capabilities
- Advanced caching strategies
- Real-time analytics updates

## Development & Deployment

### Development Setup
1. Clone repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server on http://localhost:3000
4. Access application and test all features

### Build Process
- Vite handles bundling and optimization
- Tailwind CSS purging for minimal bundle size
- Modern JavaScript transpilation
- Source maps for debugging

### Testing Strategy
- Manual testing of all user flows
- Edge case validation (expired URLs, invalid inputs)
- Cross-browser compatibility testing
- Mobile responsiveness verification

This architecture provides a solid foundation for a scalable, maintainable URL shortener application with excellent user experience and robust error handling.
