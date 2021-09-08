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
        private static List<JSchema> _schemas = new();

        public static void LoadSchemas()
        {
            _schemas.Clear();
            var schemaPath = Path.Join(AppDomain.CurrentDomain.BaseDirectory, "MessageSchemas");
            
            var files = Directory.GetFiles(schemaPath, "*.json");
            foreach (var schemaFile in files)
            {
                using var reader = File.OpenText(schemaFile);
                var schema = JSchema.Load(new JsonTextReader(reader));
                _schemas.Add(schema);
            }
        }
        
        public static JSchema GetDiscoverySchema()
        {
            return _schemas.FirstOrDefault(s => s.Title is "discovery_schema");
        }

        public static DeviceDto ParseDevice(string payload, out IList<string> messages)
        {
            messages = new List<string>();
            
            var schema = GetDiscoverySchema();
            if (schema == null)
            {
                return null;
            }

            var config = JObject.Parse(payload);
            if (config.IsValid(schema, out messages))
            {
                var serializer = new JsonSerializer();
                return serializer.Deserialize<DeviceDto>(new JTokenReader(config));
            }

            return null;
        }
    }
}