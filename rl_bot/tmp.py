import pygame
import sys

# Initialize pygame
pygame.init()

# Game Constants
WIDTH, HEIGHT = 1000, 700
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125
BALL_RADIUS = 10
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Initialize scores
score1 = 0  # Left player score
score2 = 0  # Right player score

# Initialize screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")

# Paddle and Ball positions
ball_pos = [WIDTH // 2, HEIGHT // 2]
ball_vel = [5, 5]  # Initial ball velocity
paddle1_pos = [20, HEIGHT // 2 - PADDLE_HEIGHT // 2]  # Left paddle
paddle2_pos = [WIDTH - 20 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2]  # Right paddle
paddle_vel = 10  # Paddle movement speed

clock = pygame.time.Clock()



class Ball():
    MAX_VEL = 10
    MAX_VEL_Y = 15

    def __init__(self, x, y, rad):
        self.x = self.origin_x = x
        self.y = self.origin_y = y
        self.rad = rad
        self.x_vel = self.MAX_VEL
        self.y_vel = 0

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def reset(self):
        self.x = self.origin_x
        self.y = self.origin_y
        self.x_vel *= -1
        self.y_vel = 0


def handle_collision(ball, left, right):
    if ball.y + ball.rad >= HEIGHT or ball.y - ball.rad <= 0: # Ball hits the ceiling or floor
        ball.y_vel *= -1  # Reverse the vertical direction

    # Check the direction of the ball for paddle collision
    if ball.x_vel < 0:
        # Ball is moving left to right
        if ball.y >= left.y and ball.y <= left.y + left.height and \
                ball.x - ball.rad <= left.x + left.width:
            # Ball is hitting the left paddle
            ball.x_vel *= -1  # Reverse the horizontal direction

            middle_y = left.y + left.height / 2
            difference_in_y = middle_y - ball.y
            reduction_factor = (left.height / 2) / ball.MAX_VEL_Y
            y_vel = difference_in_y / reduction_factor
            ball.y_vel = -1 * y_vel

    else:
        # Ball is moving right to left
        if ball.y >= right.y and ball.y <= right.y + right.height and \
                ball.x + ball.rad >= right.x:
            # Ball is hitting the right paddle
            ball.x_vel *= -1  # Reverse the horizontal direction

            middle_y = right.y + right.height / 2
            difference_in_y = middle_y - ball.y
            reduction_factor = (right.height / 2) / ball.MAX_VEL_Y
            y_vel = difference_in_y / reduction_factor
            ball.y_vel = -1 * y_vel

# Game loop
running = True
while running:
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			running = False

	keys = pygame.key.get_pressed()
	if keys[pygame.K_w] and paddle1_pos[1] > 0:
		paddle1_pos[1] -= paddle_vel
	if keys[pygame.K_s] and paddle1_pos[1] < HEIGHT - PADDLE_HEIGHT:
		paddle1_pos[1] += paddle_vel
	if keys[pygame.K_UP] and paddle2_pos[1] > 0:
		paddle2_pos[1] -= paddle_vel
	if keys[pygame.K_DOWN] and paddle2_pos[1] < HEIGHT - PADDLE_HEIGHT:
		paddle2_pos[1] += paddle_vel

	# Update ball position
	ball_pos[0] += ball_vel[0]
	ball_pos[1] += ball_vel[1]

	# Collision with top and bottom
	if ball_pos[1] <= BALL_RADIUS or ball_pos[1] >= HEIGHT - BALL_RADIUS:
		ball_vel[1] = -ball_vel[1]



	# collision with paddles
	# Inside your game loop, after updating the ball's position

	# Collision with left paddle
	handle_collision(ball, paddle1_pos, paddle2_pos)

	# Check for scoring
	if ball_pos[0] <= 0:  # Right player scores
		score2 += 1
		ball_pos = [WIDTH // 2, HEIGHT // 2]  # Reset ball position
		ball_vel = [5, 5]  # Reset ball velocity
	elif ball_pos[0] >= WIDTH:  # Left player scores
		score1 += 1
		ball_pos = [WIDTH // 2, HEIGHT // 2]  # Reset ball position
		ball_vel = [-5, 5]  # Reset ball velocity to the opposite direction
	# Reset screen
	screen.fill(BLACK)

	# Draw paddles and ball
	pygame.draw.rect(screen, WHITE, (*paddle1_pos, PADDLE_WIDTH, PADDLE_HEIGHT))
	pygame.draw.rect(screen, WHITE, (*paddle2_pos, PADDLE_WIDTH, PADDLE_HEIGHT))
	pygame.draw.circle(screen, WHITE, ball_pos, BALL_RADIUS)

	pygame.display.flip()
	clock.tick(FPS)

pygame.quit()
sys.exit()
