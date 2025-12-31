import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression

# ---------- INPUT ----------
# Expecting a CSV path as command-line argument
# csv_path = sys.argv[1]  # e.g. 'data.csv'

# Read dataset
df = pd.read_csv('C:\\Users\\Aditya Jindal\\OneDrive\\Desktop\\College Data\\Minor Project\\Neurokey\\backend\\src\\Python\\keystrokeData.csv')

# Split features & target
X = df[['dwell', 'flight']].values  # using first two for 2D visualization
y = df['target'].values

# Train Logistic Regression
model = LogisticRegression()
model.fit(X, y)

# ---------- TEST POINT ----------
# Optional test point: pass through CLI or add manually
# Example: sys.argv[2:] = dwell flight interKey
if len(sys.argv) >= 4:
    test_point = np.array([[float(sys.argv[2]), float(sys.argv[3])]])
else:
    test_point = np.array([[100, 200]])  # default

# Predict class for test point
pred = model.predict(test_point)[0]

# ---------- PLOT ----------
plt.figure(figsize=(12, 9), dpi=200)


# Scatter training points
plt.scatter(X[y==0, 0], X[y==0, 1], color='red', label='Imposter')
plt.scatter(X[y==1, 0], X[y==1, 1], color='green', label='Genuine')

# Test point
plt.scatter(test_point[0, 0], test_point[0, 1],
            color='blue', edgecolor='black', s=150, marker='X',
            label=f'Test Point (Pred={pred})')

# Decision boundary grid
x_min, x_max = X[:,0].min()-10, X[:,0].max()+10
y_min, y_max = X[:,1].min()-10, X[:,1].max()+10
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 200),
                     np.linspace(y_min, y_max, 200))
Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)
plt.contourf(xx, yy, Z, alpha=0.2, cmap='RdYlGn')

plt.xlabel('Dwell Time')
plt.ylabel('Flight Time')
plt.title('Logistic Regression Decision Boundary')
plt.legend()
plt.tight_layout()
plt.grid(True, linestyle='--', alpha=0.5)
plt.tight_layout()

# Save graph
output_path = r"C:\\Users\Aditya Jindal\\OneDrive\Desktop\\College Data\\Minor Project\\Neurokey\\backend\src\\assets\\plot.png"
plt.savefig(output_path)
print("Graph saved as", output_path)
