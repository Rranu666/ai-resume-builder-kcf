import { base44 } from '@/api/base44Client';

const Core = base44.integrations.Core;

export const InvokeLLM = Core.InvokeLLM.bind(Core);
export const SendEmail = Core.SendEmail.bind(Core);
export const SendSMS = Core.SendSMS.bind(Core);
export const UploadFile = Core.UploadFile.bind(Core);
export const GenerateImage = Core.GenerateImage.bind(Core);
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile.bind(Core);

export default Core;
