import sys
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

class LogisticRegressionKeystrokeClassifier:
    def __init__(self, csv_path = 'C:\\Users\\Aditya Jindal\\OneDrive\\Desktop\\College Data\\Minor Project\\Neurokey\\backend\\src\\Python\\keystrokeData.csv'):
        """Initialize Logistic Regression classifier"""
        self.model = None
        self.scaler = StandardScaler()
        self.csv_path = csv_path
        self.is_trained = False
        self.metrics = {}
        
    def load_and_train(self):
        """Load CSV data and train the logistic regression model"""
        try:
            # Load training data using the path provided to the class
            df = pd.read_csv(self.csv_path)

            # Strip any whitespace from column names
            df.columns = df.columns.str.strip()

            # Separate features and target
            X = df[['dwell', 'flight', 'interKey']].values
            y = df['target'].values

            # Scale features
            X_scaled = self.scaler.fit_transform(X)

            # Train Logistic Regression on all data
            self.model = LogisticRegression(
                penalty='l2',
                C=1.0,
                solver='lbfgs',
                max_iter=1000,
                class_weight='balanced',
                random_state=42
            )
            self.model.fit(X_scaled, y)

            # Metrics via cross-validation
            from sklearn.model_selection import cross_val_predict
            y_pred = cross_val_predict(self.model, X_scaled, y, cv=min(5, len(y)))

            self.metrics = {
                'accuracy': accuracy_score(y, y_pred),
                'precision': precision_score(y, y_pred),
                'recall': recall_score(y, y_pred),
                'f1_score': f1_score(y, y_pred),
                'confusion_matrix': confusion_matrix(y, y_pred).tolist(),
                'coefficients': {
                    'dwell': float(self.model.coef_[0][0]),
                    'flight': float(self.model.coef_[0][1]),
                    'interKey': float(self.model.coef_[0][2]),
                    'intercept': float(self.model.intercept_[0])
                }
            }
            self.is_trained = True
            return self.metrics

        except FileNotFoundError:
            raise Exception(f"Training data file not found: {self.csv_path}")
        except Exception as e:
            raise Exception(f"Error during training: {str(e)}")

    
    def predict(self, keystroke_data):
        """
        Predict if keystroke pattern belongs to authentic user or imposter
        
        Args:
            keystroke_data: dict with keys 'dwell', 'flight', 'interKey'
                          or list of such dicts for batch prediction
        
        Returns:
            dict with prediction result(s)
        """
        if not self.is_trained:
            raise Exception("Model not trained. Call load_and_train() first.")
        
        try:
            # Handle single or batch input
            if isinstance(keystroke_data, dict):
                keystroke_data = [keystroke_data]
            
            # Extract features
            features = []
            for data in keystroke_data:
                features.append([
                    float(data['dwell']),
                    float(data['flight']),
                    float(data['interKey'])
                ])
            
            # Scale and predict
            features_scaled = self.scaler.transform(features)
            predictions = self.model.predict(features_scaled)
            probabilities = self.model.predict_proba(features_scaled)
            
            # Get decision function values (distance from hyperplane)
            # Decision function clipping to avoid huge values
            decision_values = np.clip(self.model.decision_function(features_scaled), -20, 20)

            
            # Format results
            results = []
            for i, pred in enumerate(predictions):
                results.append({
                    'prediction': int(pred),
                    'label': 'authentic_user' if pred == 1 else 'imposter',
                    'confidence': float(probabilities[i][pred]),
                    'authentic_probability': float(probabilities[i][1]),
                    'imposter_probability': float(probabilities[i][0]),
                    'decision_score': float(decision_values[i])
                })
            
            return results[0] if len(results) == 1 else results
            
        except KeyError as e:
            raise Exception(f"Missing required field: {str(e)}")
        except Exception as e:
            raise Exception(f"Prediction error: {str(e)}")
    
    # def get_feature_importance(self):
    #     """Get the importance of each feature based on coefficients"""
    #     if not self.is_trained:
    #         raise Exception("Model not trained yet")
        
    #     coef = self.model.coef_[0]
    #     features = ['dwell', 'flight', 'interKey']
        
    #     importance = {}
    #     for i, feature in enumerate(features):
    #         importance[feature] = {
    #             'coefficient': float(coef[i]),
    #             'abs_coefficient': float(abs(coef[i])),
    #             'impact': 'positive' if coef[i] > 0 else 'negative'
    #         }
        
    #     return importance

def main():
    try:
        
       



        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        # Initialize and train model
        # Provide the correct path to your preprocessed CSV
        classifier = LogisticRegressionKeystrokeClassifier(
            csv_path='C:\\Users\\Aditya Jindal\\OneDrive\\Desktop\\College Data\\Minor Project\\Neurokey\\backend\\src\\Python\\keystrokeData.csv'
        )
        training_metrics = classifier.load_and_train()

        
        # Get keystroke data from input
        keystroke_input = data.get('input')
        # print("Keystroke Input:", keystroke_input)
        if not keystroke_input:
            raise Exception("No input data provided")
        
        # Make prediction
        result = classifier.predict(keystroke_input)
        
        # Get feature importance
        # feature_importance = classifier.get_feature_importance()
        
        # Prepare output
        output = {
            'success': True,
            'model': 'Logistic Regression',
            'metrics': {
                'accuracy': round(training_metrics['accuracy'], 4),
                'precision': round(training_metrics['precision'], 4),
                'recall': round(training_metrics['recall'], 4),
                'f1_score': round(training_metrics['f1_score'], 4)
            },
            'model_coefficients': training_metrics['coefficients'],
            # 'feature_importance': feature_importance,
            'result': result
        }
        
        # Send result back to Node.js
        print(json.dumps(output))
        sys.exit(0)
        
    except Exception as e:
        error_output = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_output))
        sys.exit(1)

if __name__ == '__main__':
    main()