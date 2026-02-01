# ⚡ Quick Setup - MongoDB Atlas

## 🎯 What You Need to Do

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (use Google/GitHub for fastest setup)
3. **Create FREE cluster**:
   - Choose M0 (FREE tier)
   - Pick closest region
   - Click "Create Deployment"
4. **Create database user**:
   - Username: `growthadmin` (or your choice)
   - Password: Auto-generate (save it!)
5. **Add IP Address**: 
   - Use "My Current IP" or `0.0.0.0/0` for dev
6. **Get Connection String**:
   - Click "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add `/growthengine` before the `?`

## 📋 Example Connection String

```
mongodb+srv://growthadmin:YourPassword123@cluster0.abc123.mongodb.net/growthengine?retryWrites=true&w=majority
```

## ✅ Then Paste It Here

Once you have your connection string, paste it in the chat and I'll:
- ✅ Update backend `.env`
- ✅ Restart the server  
- ✅ Verify connection works
- ✅ Test the onboarding flow
- ✅ Confirm missions are persisting

---

**Time estimate**: 10-15 minutes total
