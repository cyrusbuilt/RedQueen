using System;
using MQTTnet.Client;

namespace RedQueen.Services
{
    public class MqttMessageReceivedEvent : EventArgs
    {
        public MqttApplicationMessageReceivedEventArgs EventData { get; }
        public string Host { get; }

        public MqttMessageReceivedEvent(MqttApplicationMessageReceivedEventArgs eventData, string host)
        {
            EventData = eventData;
            Host = host;
        }
    }

    public delegate void MqttMessageReceivedEventHandler(object sender, MqttMessageReceivedEvent evt);
}