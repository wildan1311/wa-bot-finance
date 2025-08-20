import { tool } from "@langchain/core/tools";
import { formatedChatArraySchema, FormatedChatArray } from "../schema/formated-chat-schema.ts";
import { writeSheet } from "../libs/sheet-service.ts";

const writeSheetTool = tool<any, any>(
    async (data: FormatedChatArray) => {
        console.log({data});
        const sheets = await writeSheet(data.data);
        return `🎉🎉 Selamat 🎉🎉 \n\n Data kamu telah berhasil ditulis ke Google Sheets. \n\n Berikut adalah data yang telah ditulis: \n\n ${JSON.stringify(data.data, null, 2)} \n\n Jika ada yang ingin ditambahkan atau diubah, silakan beritahu saya. \n\n Terima kasih atas kerjasamanya! \n\n Untuk melihat data di Google Sheets, silakan kunjungi: ${sheets}`;
    },
    {
        name: 'write_sheet',
        description: `Use this tool to write multiple finance records to Google Sheets. 
            The input must be an array of objects. Each object should include the following fields:
            - date (string, format: "25 Jul 2025")
            - contact (string, name or identifier of the user)
            - description (string, what the transaction is for)
            - category (string, either "pemasukan" or "pengeluaran")
            - nominal (number, positive for income, negative for expenses)

            If the user message contains multiple items (e.g., "beli ayam 5000, telur 3000"), 
            split them into separate objects in the array.
            `,
        schema: formatedChatArraySchema,
    }
)

export { writeSheetTool };
