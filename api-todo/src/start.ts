import configureApp from './server';
type RejectionReason = Error | string | null | undefined;

const port: number = !isNaN(Number(process.env.PORT))
  ? Number(process.env.PORT)
  : 3000;

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('There was an uncaught error', err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

// Handle unhandled promise rejections
process.on(
  'unhandledRejection',
  (reason: RejectionReason, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  }
);

configureApp()
  .then(({ app }) => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error while configuring the app:', error);
  });
