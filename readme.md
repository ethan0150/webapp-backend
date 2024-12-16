## Setup environment
1. Install Deno from here: https://docs.deno.com/runtime/getting_started/installation/. NPM is also needed.
2. Fork this repo
3. Clone the fork
4. ```bash
   cd webapp-backend
   deno install --allow-scripts=npm:@prisma/client@6.0.1,npm:prisma@6.0.1,npm:@prisma/engines@6.0.1,npm:protobufjs@7.4.0
   ```
5. Create a .env file in the project root directory
   
   > Apply for GOOGLE_APPLICATION_CREDENTIALS from GCP.
   > 
   > Save the downloaded JSON credentials file into the config folder.
   > 
   Ensure the .env file includes the path to the credentials file, e.g.:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./config/your-credentials-file.json
   ```
6. Try 
   ```bash
   deno run dev
   ```
   to start the backend (It's just a skeleton ATM)
7. Make PR to this repo for changes to be merged
