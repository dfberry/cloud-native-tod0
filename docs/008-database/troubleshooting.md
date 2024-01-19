# Troubleshooting

## Port 80 -> port 3005

CI won't run at a lower port. 
[Stackoverflow](https://github.com/jef/streetmerchant/issues/1466)

## Mongoose pluralized collection name by default

To force singular, need to set a mongoose setting, `mongoose.pluralize`. [Stackoverflow](https://stackoverflow.com/questions/10547118/why-does-mongoose-always-add-an-s-to-the-end-of-my-collection-name) said it could also work on schema but that failed. 

```typescript
const connectAppToMongoose = async (CONFIG, process, logger) => {
  try {
    await connectMongoose(CONFIG.database.uri, CONFIG.database.options, logger);

    // don't pluralize collection names
    mongoose.pluralize(null);

    return mongoose.connection;
  } catch (err) {
    logger.error('Error connecting to database:', err);
    process.exit(1);
  }
};
```
