# Privacy Policy for BilletLove Extension

**Last updated:** February 2025

## Overview

BilletLove is a browser extension that helps event organizers manage participants on billetweb.fr. This privacy policy explains how the extension handles your data.

## Data Collection

**We do not collect, store, or transmit any of your data to our servers.** The developer has no access to any information you use with this extension.

## Data Storage

All data is stored **locally on your device** using your browser's built-in storage mechanisms:

| Data Type        | Storage Location      | Purpose                                               |
| ---------------- | --------------------- | ----------------------------------------------------- |
| API Token        | Browser local storage | Authenticate with BilletWeb API                       |
| User preferences | Browser local storage | Remember your display and search column settings      |
| Participant data | Browser IndexedDB     | Cache participants for offline access and fast search |
| API call logs    | Browser IndexedDB     | Debug purposes (last 1000 calls only)                 |

This data never leaves your browser and is not accessible to the developer or any third party.

## Third-Party Services

### BilletWeb API

When you use the synchronization feature, the extension connects directly to the [BilletWeb API](https://www.billetweb.fr/bo/api.php) using your personal API token. This connection is made from your browser to BilletWeb's servers, and no data is routed through our servers.

The developer has no visibility into these API calls or the data returned.

## Permissions Used

| Permission                        | Reason                                                              |
| --------------------------------- | ------------------------------------------------------------------- |
| `storage`                         | Save your preferences and API token locally                         |
| `host_permissions` (billetweb.fr) | Fetch data from BilletWeb API and enhance the back-office interface |

## Data Sharing

**We do not share any data** because we do not have access to any data. All information stays on your device.

## Data Retention

- Data is stored locally until you uninstall the extension or clear your browser data
- You can clear all extension data at any time through your browser settings
- API call logs are automatically limited to the most recent 1000 entries

## Changes to This Policy

If we make changes to this privacy policy, we will update the "Last updated" date at the top of this document.

## Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository:

[GitHub Issues](https://github.com/jereze/billetlove/issues)
