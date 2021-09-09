using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using RedQueen.Data.Models.Dto;

namespace RedQueen.JsonMessages
{
    public static class MessageParser
    {
        private static readonly List<JSchema> Schemas = new();

        public static void LoadSchemas()
        {
            Schemas.Clear();
            var schemaPath = Path.Join(AppDomain.CurrentDomain.BaseDirectory, "MessageSchemas");
            
            var files = Directory.GetFiles(schemaPath, "*.json");
            foreach (var schemaFile in files)
            {
                using var reader = File.OpenText(schemaFile);
                var schema = JSchema.Load(new JsonTextReader(reader));
                Schemas.Add(schema);
            }
        }
        
        public static JSchema GetDiscoverySchema()
        {
            return Schemas.FirstOrDefault(s => s.Title is "discovery_schema");
        }

        public static DeviceConfig ParseDevice(string payload, out IList<string> messages)
        {
            messages = new List<string>();
            
            var schema = GetDiscoverySchema();
            if (schema == null)
            {
                return null;
            }

            try
            {
                var config = JObject.Parse(payload);
                if (config.IsValid(schema, out messages))
                {
                    var serializer = new JsonSerializer();
                    return serializer.Deserialize<DeviceConfig>(new JTokenReader(config));
                }
            }
            catch (JsonReaderException ex)
            {
                messages.Add(ex.Message);
            }

            return null;
        }
    }
}