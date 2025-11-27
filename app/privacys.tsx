import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';

export default function PrivacyScreen() {
  const { language } = useLanguage();
  const router = useRouter();

  const privacyContent = {
    en: [
      { title: 'Data Collection', content: 'We collect only necessary information to provide water issue reporting services, including your name, email, and location data when you submit reports.' },
      { title: 'Data Usage', content: 'Your information is used to process reports, communicate updates, and improve our services. We never sell your data to third parties.' },
      { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal information from unauthorized access.' },
      { title: 'Your Rights', content: 'You can access, update, or delete your personal information at any time through your account settings.' },
      { title: 'Contact', content: 'For privacy concerns, contact us at privacy@shegareport.com' }
    ],
    am: [
      { title: 'የውሂብ ስብስብ', content: 'የውሃ ችግር ሪፖርት አገልግሎት ለመስጠት አስፈላጊ የሆነ መረጃ ብቻ እንሰበስባለን፣ ሪፖርት በሚያስገቡበት ጊዜ ስምዎ፣ ኢሜይልዎ እና የአካባቢ መረጃ ያካትታል።' },
      { title: 'የውሂብ አጠቃቀም', content: 'ሪፖርቶችን ለማስተናገድ፣ ማዘመኛዎችን ለመግባባት እና አገልግሎታችንን ለማሻሻል መረጃዎን እንጠቀማለን። ውሂብዎን ለሦስተኛ ወገኖች አንሸጥም።' },
      { title: 'የውሂብ ደህንነት', content: 'የግል መረጃዎን ከተፈቀደላቸው ያልሆኑ መዳረሻዎች ለመከላከል የصنعت መስፈርት የደህንነት እርምጃዎችን እንተገንዘባለን።' },
      { title: 'የእርስዎ መብቶች', content: 'የግል መረጃዎን በማንኛውም ጊዜ በመለያ ቅንብሮችዎ በኩል ማየት፣ ማዘመን ወይም ማጥፋት ትችላለህ።' },
      { title: 'ግንኙነት', content: 'ለግላዊነት በሚጠየቁ ጉዳዮች በ privacy@shegareport.com ያግኙን።' }
    ]
  };

  const content = privacyContent[language];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#0a5398ff] px-6 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            {language === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className=" rounded-2xl ">
          <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
            {language === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ'}
          </Text>

          {content.map((item, index) => (
            <View key={index} className="mb-6">
              <Text className="text-lg font-semibold text-black-600 mb-2">
                {item.title}
              </Text>
              <Text className="text-gray-800 leading-6">
                {item.content}
              </Text>
            </View>
          ))}

          <Text className="text-gray-800 text-sm text-center mt-8">
            {language === 'en' 
              ? 'Last updated: September 2025'
              : 'የመጨረሻ ማዘመን: መስከረም 2025'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}