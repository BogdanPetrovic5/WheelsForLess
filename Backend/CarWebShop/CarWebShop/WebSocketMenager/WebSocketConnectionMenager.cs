using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace CarWebShop.Utilities
{
    public class WebSocketConnectionManager
    {
        private readonly ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        public void AddSocket(string socketParameter, WebSocket socket)
        {
            
            _sockets.TryAdd(socketParameter, socket);
        }

        public async Task RemoveSocket(string socketParameter)
        {
            if (_sockets.TryRemove(socketParameter, out var socket) && socket != null)
            {
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the WebSocketManager", CancellationToken.None);
            }
        }

        public async Task SendMessageToUserAsync(string socketParameter, string message)
        {
            if (_sockets.TryGetValue(socketParameter, out var socket) && socket.State == WebSocketState.Open)
            {
                try
                {
                    var buffer = Encoding.UTF8.GetBytes(message);
                    await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
                    Console.WriteLine($"Message sent to user/chat {socketParameter}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send message to user/chat {socketParameter}: {ex.Message}");
                    
                }
            }
            else
            {
                Console.WriteLine($"User/User in the chat: {socketParameter} not found or WebSocket not open");
                
            }
        }

        public async Task BroadcastMessageAsync(string message)
        {
            var tasks = _sockets.Values.Select(async socket =>
            {
                if (socket.State == WebSocketState.Open)
                {
                    var buffer = Encoding.UTF8.GetBytes(message);
                    await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            });

            await Task.WhenAll(tasks);
        }
    }
}

