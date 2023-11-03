from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from pymongo import MongoClient

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key
client = MongoClient('mongodb://localhost:27017/')
db = client['webapp_db']

login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, username):
        self.username = username

    def get_id(self):
        return self.username  # Added for Flask-Login

@login_manager.user_loader
def load_user(username):
    user_data = db.users.find_one({'username': username})
    if user_data:
        return User(username=user_data['username'])

@app.route('/')
def home():
    if current_user.is_authenticated:
        return render_template('home.html')
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_data = db.users.find_one({'username': username, 'password': password})
        if user_data:
            user = User(username=user_data['username'])
            login_user(user)
            return redirect(url_for('home'))
    return render_template('login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return 'Welcome to the Dashboard'

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # Check if the username already exists in the database
        existing_user = db.users.find_one({'username': username})
        if existing_user:
            return 'Username already exists. Please choose a different username.'
        # Add the new user to the database
        db.users.insert_one({'username': username, 'password': password})
        return redirect(url_for('login'))
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True)
