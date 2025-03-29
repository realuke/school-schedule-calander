import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# 직선 1
t = np.linspace(-5, 5, 100)
x1 = 1 + t
y1 = -2 + 3*t
z1 = 4 - t

# 직선 2
s = np.linspace(-5, 5, 100)
x2 = 2 + s
y2 = 1 + 2*s
z2 = 3 - 4*s

# 교점
intersection = (2, 1, 3)

# 3D 그래프 그리기
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# 직선 그리기
ax.plot(x1, y1, z1, label='Line 1 (L1)', color='blue')
ax.plot(x2, y2, z2, label='Line 2 (L2)', color='red')

# 교점 표시
ax.scatter(*intersection, color='green', s=100, label='Intersection (2, 1, 3)')

# 그래프 설정
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')
ax.legend()
plt.title('3D Visualization of Lines and Intersection')
plt.show()
