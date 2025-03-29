import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def is_point_on_line(line_point, line_direction, point):
    # 직선의 매개변수 방정식에 따라 점이 직선 위에 있는지 확인
    p0 = np.array(line_point)
    d = np.array(line_direction)
    p = np.array(point)

    # 직선의 방향 벡터와 점의 벡터의 비율을 계산
    if np.all(d == 0):
        return np.array_equal(p0, p)  # 방향 벡터가 0인 경우, 시작점과 점이 같아야 함

    # 비율 계산
    t = (p - p0) / d
    return np.all(t == t[0])  # 모든 비율이 같아야 함

def plot_line_and_point(line_point, line_direction, point):
    # 직선의 시작점과 방향
    p0 = np.array(line_point)
    d = np.array(line_direction)

    # 직선의 매개변수 방정식 출력
    print(f"직선의 매개변수 방정식: x = {line_point[0]} + {line_direction[0]}t, y = {line_point[1]} + {line_direction[1]}t, z = {line_point[2]} + {line_direction[2]}t")

    # 직선의 점들을 생성
    t = np.linspace(-10, 10, 100)  # t의 범위 설정
    line_points = p0 + t[:, np.newaxis] * d  # 직선의 점들

    # 3D 그래프 생성
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # 직선 그리기
    ax.plot(line_points[:, 0], line_points[:, 1], line_points[:, 2], label='Line', color='b')

    # 특정 점이 직선 위에 있는지 확인
    if is_point_on_line(line_point, line_direction, point):
        point_color = 'g'  # 초록색
    else:
        point_color = 'r'  # 빨간색

    # 특정 점 그리기
    ax.scatter(point[0], point[1], point[2], color=point_color, s=100, label='Point')

    # 그래프 설정
    ax.set_xlabel('X axis')
    ax.set_ylabel('Y axis')
    ax.set_zlabel('Z axis')
    ax.set_title('3D Line made by jinhyoung')
    ax.legend()

    # 그래프 보여주기
    plt.show()

# 사용자로부터 입력 받기
line_input = input("직선의 매개변수 방정식 (시작점 x0,y0,z0, 방향 dx,dy,dz) 입력 (예: 0,0,0 1,2,3): ")

point_input = input("확인할 점 (x, y, z) 입력 (예: 1, 2, 3): ")

# 입력값을 분리
line_parts = line_input.split()
line_point = tuple(map(float, line_parts[0].split(',')))
line_direction = tuple(map(float, line_parts[1].split(',')))
point = tuple(map(float, point_input.split(',')))

# 직선과 점 그리기
plot_line_and_point(line_point, line_direction, point)
