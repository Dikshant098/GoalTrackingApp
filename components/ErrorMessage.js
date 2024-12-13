import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, Button, Text } from 'react-native-paper';
import { Colors } from '../constants/styles';

const ErrorMessage = ({ visible, message, onClose }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title style={{ textAlign: 'center' }}>Error</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.messageText}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onClose}
              style={styles.fullWidthButton}
              rippleColor="rgba(255, 255, 255, 0.32)" // Custom ripple effect color
            >
              Close
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: Colors.primaryColor
  },
});

export default ErrorMessage;
