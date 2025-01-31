import axios from "axios";

const API_URL = "https://graph.facebook.com/v21.0/472391889294613/messages";

// You should store this in an environment variable
const ACCESS_TOKEN =
  "EAAR4Iz3BWgkBO8BIaMjD1iDZA8zm8ZBfsnyTmZB2w3Nf1PlmJPcGTuYygu1eSza8JptWzHuOPcNbBiDC2ztu0teF9eBmjzh9M3JZA2obZCuPYbgnsamuRe5BNFlVP16of1vXdth6OQoYJ8LvdsnpazhrdPCVYZC47DhGTiTtR4jrKNKBuoWh7ri9s5POM2vRIU0RHLNiJgkn60QtVJBQZDZD";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const sendWhatsAppMessage = async (customerData) => {
  try {
    const messageData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: customerData.phone,
      type: "template",
      template: {
        name: "emipayments",
        language: {
          code: "kn",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: customerData.name,
              },
              {
                type: "text",
                text: customerData.bank || "Federal Bank",
              },
              {
                type: "text",
                text: customerData.month,
              },
              {
                type: "currency",
                currency: {
                  fallback_value: customerData.amount,
                  code: "INR",
                  amount_1000:
                    parseFloat(customerData.amount.replace(/[^\d.]/g, "")) *
                    1000,
                },
              },
              {
                type: "date_time",
                date_time: {
                  fallback_value: customerData.dueDate,
                },
              },
            ],
          },
        ],
      },
    };

    const response = await api.post("", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

export const getCustomers = async () => {
  // This is a mock function - replace with your actual API endpoint
  return [
    {
      id: 1,
      name: "Venkateswaran",
      amount: "2,155.00",
      month: "December",
      dueDate: "22-10-2024",
      phone: "+918511044804",
      bank: "Federal Bank",
    },
    {
      id: 2,
      name: "Rahul Kumar",
      amount: "3,500.00",
      month: "January",
      dueDate: "25-10-2024",
      phone: "+918511044804",
      bank: "Federal Bank",
    },
    {
      id: 3,
      name: "Priya Singh",
      amount: "4,200.00",
      month: "December",
      dueDate: "28-10-2024",
      phone: "+918511044804",
      bank: "Federal Bank",
    },
    {
      id: 4,
      name: "Vaishakh",
      amount: "2,255.00",
      month: "May",
      dueDate: "22-10-2024",
      phone: "+918511044804",
      bank: "Federal Bank",
    },
  ];
};
