import { patternOutcome, patternIncome } from '../const/pattern.ts';
import { FormattedChat } from '../types/types';

const formatedChat = (chat : string) : FormattedChat[] | null => {
    const cleanChat = chat.replace(/^\S+\s*/, '').trim();
    console.log('Processing chat:', cleanChat);

    const match = cleanChat.match(patternOutcome) || cleanChat.match(patternIncome);

    if (!match) {
        return null; // Return an empty object if no match is found
    }
    const [, description, nominal, date , category] = match;
    console.log('Match result:', {description, nominal, date, category});
    console.log('Match 0:', match[0]);
    const parsedNominal = match[0].split(' ')[0] === 'Bayar' ? Number(nominal) * -1 : Number(nominal);
    console.log({parsedNominal});
    return [{
        date,
        description,
        category,
        nominal: parsedNominal,
    }] as FormattedChat[];
}

export default formatedChat;