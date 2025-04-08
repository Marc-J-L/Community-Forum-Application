using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Newtonsoft.Json;

namespace backend.Services
{
    public static class FirebaseConfig
    {
        private static FirebaseApp _app;
        private static FirestoreDb _firestoreDb;

        public static void Initialize()
        {
            if (_app == null)
            {
                try
                {
                    var credentials = new
                    {
                        type = "service_account",
                        project_id = Environment.GetEnvironmentVariable("FIREBASE_PROJECT_ID"),
                        private_key = Environment.GetEnvironmentVariable("FIREBASE_PRIVATE_KEY")?.Replace("\\n", "\n"),
                        client_email = Environment.GetEnvironmentVariable("FIREBASE_CLIENT_EMAIL"),
                        client_id = Environment.GetEnvironmentVariable("FIREBASE_CLIENT_ID"),
                        auth_uri = Environment.GetEnvironmentVariable("FIREBASE_AUTH_URI"),
                        token_uri = Environment.GetEnvironmentVariable("FIREBASE_TOKEN_URI"),
                        auth_provider_x509_cert_url = Environment.GetEnvironmentVariable("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                        client_x509_cert_url = Environment.GetEnvironmentVariable("FIREBASE_CLIENT_X509_CERT_URL"),
                        universe_domain = Environment.GetEnvironmentVariable("FIREBASE_UNIVERSE_DOMAIN"),
                    };

                    var json = JsonConvert.SerializeObject(credentials);
                    var credential = GoogleCredential.FromJson(json);

                    _app = FirebaseApp.Create(new AppOptions
                    {
                        Credential = credential,
                        ProjectId = credentials.project_id
                    });

                    // Create FirestoreDb
                    var builder = new FirestoreDbBuilder
                    {
                        ProjectId = credentials.project_id,
                        Credential = credential
                    };
                    _firestoreDb = builder.Build();

                    Console.WriteLine("Firebase initialized successfully.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error initializing Firebase: {ex.Message}");
                    throw;
                }
            }
        }

        public static FirestoreDb GetFirestoreDb()
        {
            if (_firestoreDb == null)
            {
                throw new InvalidOperationException("Firebase has not been initialized. Call Initialize() first.");
            }
            return _firestoreDb;
        }
    }
}
