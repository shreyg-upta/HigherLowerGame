import requests
import json

output_list = []

print("Enter Codeforces handles (type 'quit' to finish):")

while True:
    user_input = input().strip()
    if user_input.lower() == "quit":
        break

    # Call Codeforces API
    url = f"https://codeforces.com/api/user.info?handles={user_input}&checkHistoricHandles=true"
    try:
        response = requests.get(url)
        data = response.json()
        
        if data["status"] == "OK":
            user_info = data["result"][0]
            max_rating = user_info.get("maxRating", 0)
            friend_count = user_info.get("friendOfCount", 0)

            if max_rating > 1200 or friend_count > 25:
                output_list.append(user_input)
        else:
            print(f"API returned error for handle: {user_input}")

    except Exception as e:
        print(f"Error fetching data for {user_input}: {e}")

# Write to file
with open("filtered_handles.py", "w") as f:
    f.write(json.dumps(output_list, indent=4))

print(f"Filtered handles saved to 'filtered_handles.py'.")
