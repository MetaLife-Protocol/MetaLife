import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import useSchemaStyles, {
  colorsSchema,
} from '../../../../shared/UseSchemaStyles';
import {connect} from 'react-redux';
import NativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import RoundBtn from '../../../../shared/comps/RoundBtn';
import {submitFeedback} from '../../../../remote/pubOP';
import Toast from 'react-native-tiny-toast';
import {useNavigation} from '@react-navigation/native';

const Feedback = ({user}) => {
  const {flex1, FG, BG, row, alignSelfCenter, text, marginTop10, modalFG} =
      useSchemaStyles(),
    {textHolder} = colorsSchema;
  const {isIPhoneX_deprecated} = NativeDeviceInfo.getConstants();
  const {goBack} = useNavigation();
  const tags = ['Problem', 'Suggestion'];
  const [selected, setSelected] = useState(0);

  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');

  const renderPage = () => {
    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[flex1]}>
            <Text style={styles.tip}>
              {selected === 0 ? 'What’s wrong?' : 'What’s the suggestion?'}
            </Text>
            <TextInput
              allowFontScaling={false}
              style={[text, styles.copyBorder]}
              multiline={true}
              textAlignVertical={'top'}
              value={content}
              placeholder={
                'Please leave your valuable comments and suggestions ,we will try our best to improve.'
              }
              placeholderTextColor={textHolder}
              onChangeText={setContent}
            />
            <Text style={styles.tip}>Your email address?</Text>
            <TextInput
              allowFontScaling={false}
              style={[text, styles.email]}
              textAlignVertical={'top'}
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              placeholder={'please leave your E-mail address.'}
              placeholderTextColor={textHolder}
              onChangeText={setEmail}
            />
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <RoundBtn
            style={[{marginBottom: 20}]}
            title={'Submit'}
            disabled={!(content && email)}
            press={async () => {
              if (email.indexOf('@') === -1) {
                Toast.show('invalid email address!', {
                  position: Toast.position.CENTER,
                });
                return;
              }
              const feedback = await submitFeedback(
                user.feedId,
                selected === 0 ? 'problem' : 'suggestion',
                content,
                email,
              );
              if (feedback) {
                Toast.show('submit success!', {
                  position: Toast.position.CENTER,
                });
                goBack();
              } else {
                Toast.show('failed, submit later!', {
                  position: Toast.position.CENTER,
                });
              }
            }}
          />
        </KeyboardAvoidingView>
      </>
    );
  };

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <View style={[row]}>
        {tags.map((value, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setContent('');
              setSelected(index);
            }}
            style={styles.tagActive}>
            <Text
              style={
                selected === index
                  ? [styles.tagActive, text]
                  : [styles.tagDefault, flex1]
              }>
              {value}
            </Text>
            {selected === index && (
              <View style={[styles.indicator, alignSelfCenter]} />
            )}
          </Pressable>
        ))}
      </View>
      <View style={[styles.line, modalFG]} />
      {renderPage()}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  tip: {
    color: '#8E8E92',
    fontSize: 15,
    marginHorizontal: 15,
    marginTop: 15,
  },
  copyBorder: {
    height: 135,
    borderColor: '#4E586E',
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 15,
  },
  email: {
    height: 55,
    fontSize: 15,
    margin: 15,
    padding: 10,
    borderColor: '#4E586E',
    borderWidth: 1,
    borderRadius: 12,
  },
  tagDefault: {
    width: 120,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 46,
    color: '#8E8E92',
  },
  tagActive: {
    width: 120,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 46,
    color: '#E2EDEA',
    fontSize: 15,
    height: 46,
  },
  indicator: {
    height: 2,
    width: 70,
    backgroundColor: colorsSchema.primary,
  },
  line: {
    height: 0.5,
    width: '100%',
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
    user: s.user,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Feedback);
