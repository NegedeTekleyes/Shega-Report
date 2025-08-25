// app/(tabs)/help.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';
import { Linking } from 'react-native';

export default function HelpScreen() {
  const { language } = useLanguage();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const faqs = {
    en: [
      {
        question: 'How do I report a water issue?',
        answer: 'Go to the Report tab, fill in the details about the issue, add photos if available, and submit. Our team will review it promptly.'
      },
      {
        question: 'How long does it take to resolve issues?',
        answer: 'Response time varies based on issue severity. Emergency issues are prioritized and typically addressed within 24 hours.'
      },
      {
        question: 'Can I track my reported issues?',
        answer: 'Yes, you can view all your submitted reports and their status in the Reports section of your profile.'
      },
      {
        question: 'Is the service free to use?',
        answer: 'Yes, ShegaReport is completely free for residents of Debre Birhan to report water and sanitation issues.'
      }
    ],
    am: [
      {
        question: 'የውሃ ችግር እንዴት ሪፖርት ማድረግ እችላለሁ?',
        answer: 'ወደ ሪፖርት ትር ይሂዱ፣ ስለ ችግሩ ዝርዝሮችን ይሙሉ፣ ፎቶዎች ካሉዎት ያክሉ እና ያስገቡ። ቡድናችን በተጠናከረ ሁኔታ ይገመግመዋል።'
      },
      {
        question: 'ችግሮችን ለመፍታት ምን ያህል ጊዜ ይወስዳል?',
        answer: 'የምላሽ ጊዜ በችግሩ ከባድነት ላይ የተመሰረተ ነው። አስቸኳይ ችግሮች ቅድሚያ ያገኛሉ እና በተለምዶ በ24 ሰዓታት ውስጥ ይፈታሉ።'
      },
      {
        question: 'የተጠቆሙትን ችግሮች መከታተል እችላለሁ?',
        answer: 'አዎ፣ ሁሉንም የገቡትን ሪፖርቶች እና ሁኔታቸውን በመገለጫዎ ውስጥ ባለው የሪፖርቶች ክፍል ማየት ትችላለህ።'
      },
      {
        question: 'አገልግሎቱ ነፃ ነው?',
        answer: 'አዎ፣ ሸጋሪፖርት ለደብረ ብርሃን ነዋሪዎች የውሃ እና የንፅህና ችግሮችን ሪፖርት ለማድረግ ሙሉ በሙሉ ነፃ ነው።'
      }
    ]
  };

  const contactMethods = [
    {
      icon: 'call',
      title: language === 'en' ? 'Call Support' : 'ድጋፍ ይደውሉ',
      action: () => Linking.openURL('tel:+251911234567')
    },
    {
      icon: 'mail',
      title: language === 'en' ? 'Email Us' : 'ኢሜይል ይጻፉ',
      action: () => Linking.openURL('mailto:support@shegareport.com')
    },
    {
      icon: 'chatbubble',
      title: language === 'en' ? 'Live Chat' : 'ቀጥታ ውይይት',
      action: () => Alert.alert(
        language === 'en' ? 'Live Chat' : 'ቀጥታ ውይይት',
        language === 'en' ? 'Live chat available Mon-Fri, 8AM-5PM' : 'ቀጥታ ውይይት ሰኞ-ዓርብ፣ 8፡00-5፡00 ይገኛል'
      )
    }
  ];

  const handleSubmit = () => {
    if (message.trim()) {
      Alert.alert(
        language === 'en' ? 'Message Sent' : 'መልእክት ተልኳል',
        language === 'en' ? 'We\'ll get back to you within 24 hours.' : 'በ24 ሰዓታት ውስጥ እንመለስሻለን።',
        [{ text: 'OK', onPress: () => setMessage('') }]
      );
    }
  };

  const content = faqs[language];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            {language === 'en' ? 'Help & Support' : 'እርዳታ እና ድጋፍ'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Contact Methods */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Get Help Quickly' : 'ፈጣን እርዳታ ያግኙ'}
          </Text>
          
          <View className="flex-row justify-between">
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={method.action}
                className="items-center flex-1 mx-1"
              >
                <View className="w-12 h-12 bg-green-100 rounded-full justify-center items-center mb-2">
                  <Ionicons name={method.icon} size={24} color="#16a34a" />
                </View>
                <Text className="text-gray-700 text-xs text-center">
                  {method.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Frequently Asked Questions' : 'ተደጋግሞ የሚጠየቁ ጥያቄዎች'}
          </Text>
          
          {content.map((faq, index) => (
            <View key={index} className="mb-4">
              <Text className="text-lg font-semibold text-green-600 mb-1">
                {faq.question}
              </Text>
              <Text className="text-gray-600 text-sm">
                {faq.answer}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Form */}
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Send us a Message' : 'መልእክት ይጻፉ'}
          </Text>
          
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base h-32 mb-4"
            placeholder={language === 'en' ? 'Describe your issue or question...' : 'ችግርዎን ወይም ጥያቄዎን ይግለጹ...'}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!message.trim()}
            className={`bg-green-600 py-3 rounded-xl ${
              !message.trim() ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {language === 'en' ? 'Send Message' : 'መልእክት ይላኩ'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}