import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';

const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '').slice(-11);
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

const MaterialContactCard = ({ name, role, phone, email }) => (
  <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg flex flex-col">
    <h3 className="text-lg font-medium text-gray-800 mb-1">{name}</h3>
    <p className="text-sm text-gray-600 mb-3">{role}</p>
    <div className="flex flex-col space-y-2 flex-grow">
      <div className="flex items-center text-gray-700">
        <Phone size={18} className="mr-2 flex-shrink-0" />
        <span>{formatPhoneNumber(phone)}</span>
      </div>
      <a
        href={`mailto:${email}`}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Mail size={18} className="mr-2 flex-shrink-0" />
        <span className="whitespace-nowrap overflow-x-auto">{email}</span>
      </a>
      <a
        href={`https://wa.me/${phone.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-green-600 hover:text-green-800 transition-colors mt-auto"
      >
        <MessageSquare size={18} className="mr-2 flex-shrink-0" />
        <span>WhatsApp</span>
      </a>
    </div>
  </div>
);

const MaterialContactsSection = () => {
  const contacts = [
    { name: 'Athos', role: 'Intermediador', phone: '+5531988598058', email: 'athosmartins@gmail.com' },
    { name: 'Henrique', role: 'Argon Engenharia', phone: '+5531996885771', email: 'henrique@argonengenharia.com' },
    { name: 'Fernando', role: 'Dacosta Incorporadora', phone: '+5531997090500', email: 'fernando@dacostaincorporadora.com' },
    { name: 'Ricardo', role: 'Proprietário', phone: '+5531985271381', email: 'riaro26@yahoo.com.br' },
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contatos Relevantes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact, index) => (
          <MaterialContactCard key={index} {...contact} />
        ))}
      </div>
    </div>
  );
};

export default MaterialContactsSection;