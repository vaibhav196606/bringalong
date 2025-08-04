# Trip Cleanup System

## Overview
The automatic trip cleanup system removes expired trips from the database to keep the system clean and efficient. Trips are considered expired when their travel date (or return date if available) has passed by 30 days.

## How It Works

### Automatic Cleanup
- **Schedule**: Runs every 24 hours automatically when the server starts
- **Logic**: Deletes trips where travel date OR return date has passed by 30+ days
- **Associated Data**: Also removes all requests associated with deleted trips
- **Logging**: Provides detailed console output for monitoring

### Cleanup Criteria
A trip is marked for deletion if:
1. **Travel Date Only**: Travel date is 30+ days old AND no return date exists
2. **Return Date Exists**: Return date is 30+ days old (regardless of travel date)

### What Gets Deleted
- The trip record itself
- All requests associated with the trip
- Trip metadata (view counts, etc.)

## Manual Cleanup

### API Endpoint
```
POST /api/trips/cleanup
```

### Usage
```bash
# Test cleanup manually
curl -X POST http://localhost:5000/api/trips/cleanup
```

### Response
```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "deleted": 5,
  "errors": [],
  "deletedTrips": [
    {
      "tripId": "64f8a1234567890abcdef123",
      "route": "New York, USA → London, UK",
      "travelDate": "2025-06-15T00:00:00.000Z",
      "returnDate": "2025-06-25T00:00:00.000Z",
      "deletedRequests": 3
    }
  ]
}
```

## Configuration

### Change Cleanup Frequency
In `server/index.js`, modify the scheduleCleanup parameter:
```javascript
// Run every 12 hours instead of 24
scheduleCleanup(12);

// Run every week (168 hours)
scheduleCleanup(168);
```

### Change Expiry Period
In `server/utils/cleanup.js`, modify the cutoff calculation:
```javascript
// Change from 30 days to 60 days
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);

// Change to 7 days
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);
```

## Monitoring

### Server Logs
The cleanup system provides detailed logging:
- `🧹 Starting cleanup of expired trips...`
- `📊 Found X expired trips to delete`
- `🗑️ Deleted trip: Route (X requests)`
- `✅ Cleanup completed: X trips deleted, Y errors`
- `❌ Error messages for any failures`

### Database Impact
- Keeps the database lean and performant
- Prevents accumulation of outdated trip data
- Maintains referential integrity by removing associated requests

## Safety Features

1. **Error Handling**: Individual trip deletion failures don't stop the entire cleanup
2. **Logging**: All actions are logged for audit purposes
3. **Graceful Degradation**: Server continues running even if cleanup fails
4. **Manual Override**: Admin can trigger cleanup manually via API

## Testing

### Test Scenarios
1. **No Expired Trips**: System reports "No expired trips found to clean up"
2. **With Expired Trips**: System reports deletion count and details
3. **Error Handling**: Continues processing other trips if one fails
4. **Manual Trigger**: POST to `/api/trips/cleanup` works correctly

### Development Testing
```bash
# Create test trips with old dates in MongoDB
# Then run manual cleanup to see the system work
curl -X POST http://localhost:5000/api/trips/cleanup
```

## Benefits

1. **Database Efficiency**: Removes unnecessary data automatically
2. **User Experience**: Users see only relevant, current trips
3. **Storage Optimization**: Reduces database size over time
4. **Maintenance Free**: Runs automatically without manual intervention
5. **Audit Trail**: Complete logging of all cleanup activities
