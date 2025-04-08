using System.Text.Json;
using System.Text.Json.Serialization;
using Google.Cloud.Firestore;

namespace backend.Utilities
{
    public class TimestampConverter : JsonConverter<Timestamp>
    {
        public override Timestamp Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            throw new NotImplementedException();
        }

        public override void Write(Utf8JsonWriter writer, Timestamp value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToDateTime().ToString("o"));
        }
    }
}
