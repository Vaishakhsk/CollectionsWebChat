import axios from "axios";

const API_URL = process.env.REACT_APP_WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.REACT_APP_WHATSAPP_ACCESS_TOKEN;

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
  //neeed api for retrieving customers data
  return [
    {
      id: 1,
      name: "Usman",
      amount: "2,155.00",
      month: "December",
      dueDate: "22-10-2024",
      phone: "+917006572213",
      bank: "Federal Bank",
    },
    {
      id: 2,
      name: "Manju",
      amount: "3,500.00",
      month: "January",
      dueDate: "25-10-2024",
      phone: "+918970824224",
      bank: "KVB Bank",
    },
    {
      id: 3,
      name: "Shiyas",
      amount: "2,255.00",
      month: "May",
      dueDate: "22-10-2024",
      phone: "+919611295145",
      bank: "Dhanlaxmi Bank",
    },
    {
      id: 4,
      name: "Vinay",
      amount: "14,200.00",
      month: "December",
      dueDate: "28-10-2024",
      phone: "+916302492621",
      bank: "Federal Bank",
    },
    {
      id: 5,
      name: "Vaishakh",
      amount: "2,255.00",
      month: "May",
      dueDate: "22-10-2024",
      phone: "+918511044804",
      bank: "ICICI Bank",
    },
    {
      id: 6,
      name: "Devansh",
      amount: "2,255.00",
      month: "May",
      dueDate: "22-10-2024",
      phone: "+919711919359",
      bank: "HDFC Bank",
    },
  ];
};
