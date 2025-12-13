import React, { useState } from 'react'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "¿Cómo puedo realizar un pedido?",
      answer: "Puedes realizar un pedido seleccionando los productos que desees, personalizando tus opciones (talla, versión, mangas) y agregándolos al carrito. Luego, haz clic en 'Pedir por WhatsApp' para completar tu compra directamente con nosotros."
    },
    {
      question: "¿Cuáles son los métodos de pago disponibles?",
      answer: "Aceptamos diversos métodos de pago: tarjetas de crédito, débito, transferencias bancarias y pago contra entrega. Los detalles específicos se confirman al hacer tu pedido por WhatsApp."
    },
    {
      question: "¿Cuánto tiempo tarda el envío?",
      answer: "Los envíos dentro de la ciudad se realizan en 24-48 horas. Para envíos nacionales, el tiempo estimado es de 3-5 días hábiles. Los envíos internacionales pueden tardar de 7-15 días hábiles."
    },
    {
      question: "¿Puedo devolver un producto?",
      answer: "Sí, ofrecemos 30 días para devoluciones. El producto debe estar en perfecto estado, sin usar y con su empaque original. Contáctanos por WhatsApp para iniciar el proceso de devolución."
    },
    {
      question: "¿Las camisetas son auténticas?",
      answer: "Todas nuestras camisetas son 100% auténticas y oficiales. Trabajamos directamente con proveedores certificados y garantizamos la calidad de cada producto."
    },
    {
      question: "¿Puedo personalizar mi camiseta con nombre y número?",
      answer: "Sí, ofrecemos servicio de personalización con nombre y número dorsal. Simplemente agrega esta información al seleccionar el producto antes de agregarlo al carrito."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-light-grey">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-dark-grey">
            PREGUNTAS FRECUENTES
          </h2>
          <div className="w-24 h-1 bg-primary-red mx-auto mb-6"></div>
          <p className="text-xl text-medium-grey max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-light-grey transition-colors duration-300"
              >
                <h3 className="text-lg font-bold text-dark-grey pr-4">
                  {faq.question}
                </h3>
                <svg 
                  className={`w-6 h-6 text-primary-red flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-medium-grey">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contacto adicional */}
        <div className="mt-16 text-center">
          <p className="text-medium-grey mb-4">
            ¿No encuentras la respuesta que buscas?
          </p>
          <a 
            href="https://wa.me/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-action-green hover:bg-action-green-dark text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span>Contáctanos por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
