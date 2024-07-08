using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CarWebShop.Models
{
    public class Messages
    {
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public bool IsNew { get; set; }
        public int InitialSenderID { get; set; }
        [NotMapped]
        public string ReceiverUsername { get; set; }
        [NotMapped]
        public string SenderUsername { get; set; }
        public int AdverID { get; set; }


        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MessageID { get; set; }



        public string Message { get; set; }
        public DateTime DateSent { get; set; }
        public User Receiver { get; set; }
        public User Sender { get; set; }

        public Advertisement Advertisement { get; set; }

    }
}
