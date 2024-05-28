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

        public void AddSocket(string userId, WebSocket socket)
        {
            _sockets.TryAdd(userId, socket);
        }

        public async Task RemoveSocket(string userId)
        {
            if (_sockets.TryRemove(userId, out var socket) && socket != null)
            {
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the WebSocketManager", CancellationToken.None);
            }
        }

        public async Task SendMessageToUserAsync(string userId, string message)
        {
            if (_sockets.TryGetValue(userId, out var socket) && socket.State == WebSocketState.Open)
            {
                var buffer = Encoding.UTF8.GetBytes(message);
                await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
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

