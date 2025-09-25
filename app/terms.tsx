import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';

export default function TermsScreen() {
  const { language } = useLanguage();
  const router = useRouter();

  const termsContent = {
    en: [
      { title: 'Acceptance of Terms', content: 'By using ShegaReport, you agree to these terms and conditions. If you do not agree, please do not use our services.' },
      { title: 'Service Description', content: 'ShegaReport provides a platform for reporting water and sanitation issues in Debre Birhan municipality.' },
      { title: 'User Responsibilities', content: 'You agree to provide accurate information and use the service only for lawful purposes.' },
      { title: 'Content Ownership', content: 'You retain ownership of your reports but grant us license to use them for service provision and improvement.' },
      { title: 'Limitation of Liability', content: 'We are not liable for any damages resulting from the use of our services.' },
      { title: 'Changes to Terms', content: 'We may update these terms periodically. Continued use constitutes acceptance of changes.' }
    ],
    am: [
      { title: 'ውሎችን መቀበል', content: 'ሸጋሪፖርት በመጠቀም እነዚህን ውሎች እና ሁኔታዎች ተቀብለዋል። ካልተስማሙ እባክዎ አገልግሎታችንን አይጠቀሙ።' },
      { title: 'የአገልግሎት መግለጫ', content: 'ሸጋሪፖርት በደብረ ብርሃን ከተማ ውስጥ የውሃ እና የንፅህና ችግሮችን ለሪፖርት የሚያገለግል መድረክ ያቀርባል።' },
      { title: 'የተጠቃሚ ኃላፊነቶች', content: 'ትክክለኛ መረጃ እንደሚሰጡ እና አገልግሎቱን ለሕጋዊ ዓላማዎች ብቻ እንደሚጠቀሙ ተስማምተዋል።' },
      { title: 'የይዘት ባለቤትነት', content: 'የእርስዎ ሪፖርቶች ባለቤትነት ይዛወራሉ ነገር ግን አገልግሎት ለመስጠት እና ለማሻሻል አጠቃቀም ፍቃድ ትሰጠናለህ።' },
      { title: 'የኃላፊነት ገደብ', content: 'ለአገልግሎታችን አጠቃቀም ምክንያት የሚፈጠሩ ጉዳቶች ኃላፊነት አይወስድም።' },
      { title: 'ወደ ውሎች ለውጦች', content: 'እነዚህን ውሎች በየጊዜው ልናዘምን እንችላለን። ማዘመን ከተደረገ በኋላ መጠቀምዎ ለውጦቹን መቀበልዎን ያሳያል።' }
    ]
  };

  const content = termsContent[language];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            {language === 'en' ? 'Terms of Service' : 'የአገልግሎት ውሎች'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {language === 'en' ? 'Terms of Service' : 'የአገልግሎት ውሎች'}
          </Text>

          {content.map((item, index) => (
            <View key={index} className="mb-6">
              <Text className="text-lg font-semibold text-green-600 mb-2">
                {item.title}
              </Text>
              <Text className="text-gray-600 leading-6">
                {item.content}
              </Text>
            </View>
          ))}

          <View className="bg-green-50 p-4 rounded-lg mt-6">
            <Text className="text-green-800 text-sm text-center">
              {language === 'en'
                ? 'By using ShegaReport, you agree to our Terms of Service and Privacy Policy'
                : 'ሸጋሪፖርት በመጠቀም የአገልግሎት ውሎቻችንን እና የግላዊነት ፖሊሲያችንን ተቀብለዋል'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}