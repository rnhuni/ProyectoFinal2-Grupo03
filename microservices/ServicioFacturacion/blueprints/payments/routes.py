import json
import uuid
from flask import Blueprint, request, jsonify

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/payments', methods=['GET'])
def get_all_payments():
    try:
        return jsonify([
            {
                "id": str(uuid.uuid4()),
                "cycleId": "3675d547-d115-4437-87b8-890c52b1f819",
                "date": "2024-01-01",
                "amount": 150.00,
                "status": "paid"
            },
            {
                "id": str(uuid.uuid4()),
                "cycleId": "4675d547-d115-4437-87b8-890c52b1f819",
                "date": "2024-01-01",
                "amount": 150.00,
                "status": "paid"
            },
            {
                "id": str(uuid.uuid4()),
                "cycleId": "5675d547-d115-4437-87b8-890c52b1f819",
                "date": "2024-01-01",
                "amount": 150.00,
                "status": "paid"
            }
        ]), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve payments. Details: {str(e)}"}), 500
    

@payments_bp.route('/payments/<payment_id>', methods=['GET'])
def get_invoice(payment_id):
    try:        
        return f"https://abcall-payments.s3.amazonaws.com/{payment_id}?AWSAccessKeyId=ASIAS66UDJC6ZCHI7FAM&Signature=MHB%2BYJkTmNHpSkMzHVHdUMnyI9s%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEAMaCXVzLWVhc3QtMSJHMEUCIFR7bcMSxSL%2BfPpRh9SQa1D2HgtZgEbDibD854kkiwYJAiEAm22xE4mV%2FgZYFtVxbw7CNv2QZ7OW3wsHZkIxNDlcd%2FUq8QMIfBAAGgwyMDM5MTg4ODcxMDEiDFTzYHpxO97AhffuSirOAzidezQ9nN%2B6Ifxlm5N5SG2Xui28tmFytVUC4IxyxyA0Bav%2FIBo1pHX31duyHg3QLOeMwnYKqjN16Jh32bXXl25w225RVCL2hlE4uQJ2AxThXaKl%2FRZkyUy9KOxogp82J0NH5AZ8g%2BjX045ZVHq7ckZhUw0tu9vSIySwumh9wtBHbHdPbEySNYZshFs7cGxxb%2FMyiwv5ne4DyDp00fwytVmX18vo8XXEZpt3puOz3MGH7VHnmAE%2B7sw9veT2DadZw6i7joKOXX5ispO8eQG9SMoZBfcpllhj2%2BEGe5kVXkqLBLaOsnEbCTSYnukVDtiRYQNwqfJrx%2FSLfFNqTs0YPhtR2m2ADVxb2SXhMQuKbjb8yt1%2FuaQgHIPYxgRdVQOJ6rqPDolS3vkKO0LoNd0wiHmqrUibiHZXD9tCELfuES14jR0t%2BnozZyoHaczzEPlfUkSX8TzNNcLoM74fOu8imlRhjmcJQB9HG0kH5V9mrAMhQoe8l2QXrpruFALpD9ikEJBGniv2eJgRgJUhV23OtrMC7a9vRqLXWK9vM4fmjY7xLghU6O769fu1dm0Bh9fvADBqPsYT52dnOzpKpwpAGYJcI36lfbHwPMvki3FLaDCq%2FIm5BjqlARSbfFEFXfhC8PoSeH8IOL6Np85rZMiv8lmOhXWButPz3wiRZfYBqpO8kwZLVwgAV9rFPUYJRBvRUo9xT%2BE6FJqLVLbxLFgEsnmIxGF6YYLiJ1CAdCPi%2FA%2BJAm72ge6u9rb0cyQMykLdgcKj5ClxdFjotptuUmXx2YiAFSv5UyVkLlo3zJo0c%2BfCFo%2FZu%2BmXU5xe2mzEY9WtlBuPY%2B5jQJmIcYIINQ%3D%3D&Expires=1730318011", 200
    except Exception as e:
        return jsonify({'error': f'Create upload url failed. Details: {str(e)}'}), 500