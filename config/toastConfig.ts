// import React from 'react';
// import { View, Text } from 'react-native';
// import { BaseToast, ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';

// export const toastConfig = {
//   /*
//     Overwrite the 'success' type
//   */
//   success: (props: any) => (
//     <SuccessToast
//       {...props}
//       style={{
//         borderLeftColor: '#10B981',
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         borderLeftWidth: 6,
//         height: 'auto',
//         minHeight: 70,
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 4,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 8,
//         elevation: 8,
//       }}
//       contentContainerStyle={{
//         paddingHorizontal: 15,
//         paddingVertical: 12,
//       }}
//       text1Style={{
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#065F46',
//       }}
//       text2Style={{
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#047857',
//         marginTop: 2,
//       }}
//       text1NumberOfLines={1}
//       text2NumberOfLines={2}
//     />
//   ),

//   /*
//     Overwrite the 'info' type
//   */
//   info: (props: any) => (
//     <InfoToast
//       {...props}
//       style={{
//         borderLeftColor: '#3B82F6',
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         borderLeftWidth: 6,
//         height: 'auto',
//         minHeight: 70,
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 4,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 8,
//         elevation: 8,
//       }}
//       contentContainerStyle={{
//         paddingHorizontal: 15,
//         paddingVertical: 12,
//       }}
//       text1Style={{
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#1E40AF',
//       }}
//       text2Style={{
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#3B82F6',
//         marginTop: 2,
//       }}
//       text1NumberOfLines={1}
//       text2NumberOfLines={2}
//     />
//   ),

//   /*
//     Overwrite the 'error' type
//   */
//   error: (props: any) => (
//     <ErrorToast
//       {...props}
//       style={{
//         borderLeftColor: '#EF4444',
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         borderLeftWidth: 6,
//         height: 'auto',
//         minHeight: 70,
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 4,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 8,
//         elevation: 8,
//       }}
//       contentContainerStyle={{
//         paddingHorizontal: 15,
//         paddingVertical: 12,
//       }}
//       text1Style={{
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#991B1B',
//       }}
//       text2Style={{
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#DC2626',
//         marginTop: 2,
//       }}
//       text1NumberOfLines={1}
//       text2NumberOfLines={2}
//     />
//   ),

//   /*
//     Custom notification type with icon
//   */
//   notification: ({ text1, text2, props }: any) => (
//     <View
//       style={{
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         padding: 16,
//         marginHorizontal: 20,
//         marginTop: 40,
//         minHeight: 80,
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 6,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 12,
//         elevation: 12,
//         borderLeftWidth: 8,
//         borderLeftColor: props?.type === 'success' ? '#10B981' : 
//                         props?.type === 'warning' ? '#F59E0B' : '#3B82F6',
//       }}
//     >
//       <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
//         <View 
//           style={{
//             backgroundColor: props?.type === 'success' ? '#D1FAE5' : 
//                             props?.type === 'warning' ? '#FEF3C7' : '#DBEAFE',
//             borderRadius: 20,
//             padding: 8,
//             marginRight: 12,
//           }}
//         >
//           <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
//             {props?.type === 'success' ? '✅' : 
//              props?.type === 'warning' ? '⚠️' : '🔔'}
//           </Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: '700',
//               color: '#1F2937',
//               marginBottom: 4,
//             }}
//             numberOfLines={1}
//           >
//             {text1}
//           </Text>
//           <Text
//             style={{
//               fontSize: 14,
//               fontWeight: '500',
//               color: '#6B7280',
//               lineHeight: 18,
//             }}
//             numberOfLines={2}
//           >
//             {text2}
//           </Text>
//         </View>
//       </View>
//     </View>
//   ),

//   /*
//     Premium notification with gradient
//   */
//   premium: ({ text1, text2, props }: any) => (
//     <View
//       style={{
//         backgroundColor: '#FFFFFF',
//         borderRadius: 20,
//         padding: 18,
//         marginHorizontal: 16,
//         marginTop: 40,
//         minHeight: 90,
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 8,
//         },
//         shadowOpacity: 0.3,
//         shadowRadius: 16,
//         elevation: 16,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Gradient accent bar */}
//       <View
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: 4,
//           backgroundColor: props?.accentColor || '#8B5CF6',
//         }}
//       />
      
//       <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
//         {/* Icon container */}
//         <View 
//           style={{
//             backgroundColor: props?.iconBgColor || '#EDE9FE',
//             borderRadius: 24,
//             padding: 12,
//             marginRight: 14,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//             elevation: 3,
//           }}
//         >
//           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
//             {props?.icon || '🎯'}
//           </Text>
//         </View>
        
//         {/* Content */}
//         <View style={{ flex: 1 }}>
//           <Text
//             style={{
//               fontSize: 17,
//               fontWeight: '800',
//               color: '#111827',
//               marginBottom: 6,
//               letterSpacing: -0.2,
//             }}
//             numberOfLines={1}
//           >
//             {text1}
//           </Text>
//           <Text
//             style={{
//               fontSize: 14,
//               fontWeight: '500',
//               color: '#4B5563',
//               lineHeight: 20,
//             }}
//             numberOfLines={3}
//           >
//             {text2}
//           </Text>
//         </View>
        
//         {/* Close indicator */}
//         <View
//           style={{
//             backgroundColor: '#F3F4F6',
//             borderRadius: 12,
//             padding: 6,
//             marginLeft: 8,
//           }}
//         >
//           <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>
//             {props?.duration || 5}s
//           </Text>
//         </View>
//       </View>
//     </View>
//   ),
// };